import * as Notifications from 'expo-notifications';
import type { Transaction } from '../types/transaction';

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

  if (current.status === 'granted') return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

function parseDueDate(value: string): Date | null {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
  if (!match) return null;

  const [day, month, year] = match.slice(1);
  const fallback = new Date(`${month} ${day}, ${year} 09:00:00`);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export async function scheduleDueDateReminder(transaction: Transaction): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const dueDate = parseDueDate(transaction.dueDate);
  if (!dueDate) return null;

  const reminderDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
  if (reminderDate.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'OweMate reminder',
      body:
        transaction.type === 'lent'
          ? `${transaction.person} is due to repay ${transaction.amount.toLocaleString('en-IN')} tomorrow.`
          : `You are due to repay ${transaction.person} ${transaction.amount.toLocaleString('en-IN')} tomorrow.`,
      data: { transactionId: transaction.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });
}

export async function cancelReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
