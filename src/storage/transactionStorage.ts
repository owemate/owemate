import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Transaction } from '../types/transaction';

const TRANSACTIONS_KEY = '@owemate/transactions';

export async function loadTransactions(): Promise<Transaction[] | null> {
  const raw = await AsyncStorage.getItem(TRANSACTIONS_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as Transaction[];
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}
