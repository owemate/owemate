import * as Notifications from 'expo-notifications';
import type { Transaction } from '../types/transaction';
import { parseUserDate } from '../utils/date';

const CHANNEL_ID = 'repayment-reminders';
const DAY_MS = 24 * 60 * 60 * 1000;

type ReminderKind = 'tomorrow' | 'due' | 'overdue';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    if (requested.status !== 'granted') return false;
  }

  await configureAndroidChannel();
  return true;
}

async function configureAndroidChannel(): Promise<void> {
  if (process.env.EXPO_OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Repayment reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
  });
}

function notificationBody(transaction: Transaction, kind: ReminderKind): string {
  const amount = `₹${transaction.amount.toLocaleString('en-IN')}`;

  if (kind === 'overdue') {
    return transaction.type === 'lent'
      ? `${transaction.person} has an overdue repayment of ${amount}.`
      : `Your repayment to ${transaction.person} of ${amount} is overdue.`;
  }

  if (kind === 'due') {
    return transaction.type === 'lent'
      ? `${transaction.person} is due to repay ${amount} today.`
      : `You are due to repay ${transaction.person} ${amount} today.`;
  }

  return transaction.type === 'lent'
    ? `${transaction.person} is due to repay ${amount} tomorrow.`
    : `You are due to repay ${transaction.person} ${amount} tomorrow.`;
}

function atLocalTime(date: Date, hour: number, minute = 0): Date {
  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
}

function startOfLocalDay(date: Date): Date {
  return atLocalTime(date, 0);
}

async function scheduleReminder(
  transaction: Transaction,
  date: Date,
  kind: ReminderKind,
): Promise<string | null> {
  if (date.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: kind === 'overdue' ? 'OweMate overdue' : 'OweMate reminder',
      body: notificationBody(transaction, kind),
      data: { transactionId: transaction.id, kind },
      ...(process.env.EXPO_OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });
}

async function scheduleTransactionReminders(transaction: Transaction): Promise<void> {
  const dueDate = parseUserDate(transaction.dueDate);
  if (!dueDate) return;

  const reminders = [
    { date: new Date(dueDate.getTime() - DAY_MS), kind: 'tomorrow' as const },
    { date: atLocalTime(dueDate, 9), kind: 'due' as const },
  ];

  for (const reminder of reminders) {
    await scheduleReminder(transaction, reminder.date, reminder.kind);
  }
}

async function scheduleOverdueReminder(transaction: Transaction, now: Date): Promise<void> {
  const reminderDate = atLocalTime(now, 9);
  if (reminderDate.getTime() <= now.getTime()) {
    reminderDate.setDate(reminderDate.getDate() + 1);
  }

  await scheduleReminder(transaction, reminderDate, 'overdue');
}

export async function scheduleDueDateReminder(transaction: Transaction): Promise<string[]> {
  if (transaction.status === 'settled') return [];
  if (!(await requestNotificationPermissions())) return [];

  const dueDate = parseUserDate(transaction.dueDate);
  if (!dueDate) return [];

  const notificationIds: string[] = [];
  const reminders = [
    { date: new Date(dueDate.getTime() - DAY_MS), kind: 'tomorrow' as const },
    { date: atLocalTime(dueDate, 9), kind: 'due' as const },
  ];

  for (const reminder of reminders) {
    const id = await scheduleReminder(transaction, reminder.date, reminder.kind);
    if (id) notificationIds.push(id);
  }

  return notificationIds;
}

export async function syncTransactionReminders(
  transactions: Transaction[],
  enabled = true,
): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const transactionIds = new Set(transactions.map((transaction) => transaction.id));

  const existingReminders = scheduled.filter((notification) => {
    const transactionId = notification.content.data?.transactionId;
    return typeof transactionId === 'string' && transactionIds.has(transactionId);
  });

  await Promise.all(
    existingReminders.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );

  if (!enabled) return;
  if ((await Notifications.getPermissionsAsync()).status !== 'granted') return;

  await configureAndroidChannel();

  const now = new Date();
  const today = startOfLocalDay(now);

  for (const transaction of transactions) {
    if (transaction.status === 'settled') continue;

    const dueDate = parseUserDate(transaction.dueDate);
    if (!dueDate) continue;

    if (startOfLocalDay(dueDate).getTime() < today.getTime()) {
      await scheduleOverdueReminder(transaction, now);
    } else {
      await scheduleTransactionReminders(transaction);
    }
  }
}
