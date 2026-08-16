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

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function scheduleDueDateReminder(transaction: Transaction): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const dueDate = parseUserDate(transaction.dueDate);
  if (!dueDate) return null;

  const reminderDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
  if (reminderDate.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'OweMate reminder',
      body:
        transaction.type === 'lent'
          ? `${transaction.person} is due to repay ₹${transaction.amount.toLocaleString('en-IN')} tomorrow.`
          : `You are due to repay ${transaction.person} ₹${transaction.amount.toLocaleString('en-IN')} tomorrow.`,
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
