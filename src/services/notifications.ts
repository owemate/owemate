import * as Notifications from 'expo-notifications';
import type { Transaction } from '../types/transaction';
import { parseUserDate } from '../utils/date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAY_MS = 24 * 60 * 60 * 1000;

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') {
    await configureAndroidChannel();
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  if (requested.status !== 'granted') return false;
  await configureAndroidChannel();
  return true;
}

async function configureAndroidChannel(): Promise<void> {
  if (process.env.EXPO_OS === 'android') {
    await Notifications.setNotificationChannelAsync('repayment-reminders', {
      name: 'Repayment reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

function notificationBody(transaction: Transaction, kind: 'tomorrow' | 'due' | 'overdue'): string {
  const amount = `₹${transaction.amount.toLocaleString('en-IN')}`;
  if (kind === 'overdue') return transaction.type === 'lent'
    ? `${transaction.person} has an overdue repayment of ${amount}.`
    : `Your repayment to ${transaction.person} of ${amount} is overdue.`;
  if (kind === 'due') return transaction.type === 'lent'
    ? `${transaction.person} is due to repay ${amount} today.`
    : `You are due to repay ${transaction.person} ${amount} today.`;
  return transaction.type === 'lent'
    ? `${transaction.person} is due to repay ${amount} tomorrow.`
    : `You are due to repay ${transaction.person} ${amount} tomorrow.`;
}

function atLocalTime(date: Date, hour: number, minute = 0): Date {
  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
}

async function schedule(transaction: Transaction, date: Date, kind: 'tomorrow' | 'due' | 'overdue'): Promise<string | null> {
  if (date.getTime() <= Date.now()) return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: kind === 'overdue' ? 'OweMate overdue' : 'OweMate reminder',
      body: notificationBody(transaction, kind),
      data: { transactionId: transaction.id, kind },
      ...(process.env.EXPO_OS === 'android' ? { channelId: 'repayment-reminders' } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });
}

export async function scheduleDueDateReminder(transaction: Transaction): Promise<string[]> {
  if (transaction.status === 'settled') return [];
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return [];
  const dueDate = parseUserDate(transaction.dueDate);
  if (!dueDate) return [];

  const scheduled: string[] = [];
  const tomorrowReminder = await schedule(transaction, new Date(dueDate.getTime() - DAY_MS), 'tomorrow');
  if (tomorrowReminder) scheduled.push(tomorrowReminder);

  const dueReminder = atLocalTime(dueDate, 9);
  const dueNotification = await schedule(transaction, dueReminder, 'due');
  if (dueNotification) scheduled.push(dueNotification);
  return scheduled;
}

export async function syncTransactionReminders(transactions: Transaction[]): Promise<void> {
  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') return;
  await configureAndroidChannel();

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const ids = new Set(transactions.map((transaction) => transaction.id));
  await Promise.all(scheduled
    .filter((notification) => {
      const transactionId = notification.content.data?.transactionId;
      return typeof transactionId === 'string' && ids.has(transactionId);
    })
    .map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier)));

  const now = new Date();
  for (const transaction of transactions) {
    if (transaction.status === 'settled') continue;
    const dueDate = parseUserDate(transaction.dueDate);
    if (!dueDate) continue;

    if (dueDate.getTime() < now.getTime()) {
      const overdueReminder = atLocalTime(new Date(), 9);
      if (overdueReminder.getTime() <= now.getTime()) overdueReminder.setDate(overdueReminder.getDate() + 1);
      await schedule(transaction, overdueReminder, 'overdue');
    } else {
      await scheduleDueDateReminderWithoutPermissionPrompt(transaction);
    }
  }
}

async function scheduleDueDateReminderWithoutPermissionPrompt(transaction: Transaction): Promise<void> {
  const dueDate = parseUserDate(transaction.dueDate);
  if (!dueDate) return;
  await schedule(transaction, new Date(dueDate.getTime() - DAY_MS), 'tomorrow');
  await schedule(transaction, atLocalTime(dueDate, 9), 'due');
}

export async function cancelReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
