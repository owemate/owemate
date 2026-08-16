import type { Transaction } from '../types/transaction';
import { supabase } from '../lib/supabase';

export async function fetchCloudTransactions(userId: string): Promise<Transaction[]> {
  if (!supabase) throw new Error('Supabase is not configured yet.');

  const { data, error } = await supabase
    .from('transactions')
    .select('id, person, amount, type, due_date, note, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    person: row.person,
    amount: Number(row.amount),
    type: row.type,
    dueDate: row.due_date ?? '',
    note: row.note ?? '',
    createdAt: row.created_at,
  } as Transaction));
}

export async function createCloudTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) {
  if (!supabase) throw new Error('Supabase is not configured yet.');

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      person: transaction.person,
      amount: transaction.amount,
      type: transaction.type,
      due_date: transaction.dueDate || null,
      note: transaction.note || null,
    })
    .select('id, person, amount, type, due_date, note, created_at')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    person: data.person,
    amount: Number(data.amount),
    type: data.type,
    dueDate: data.due_date ?? '',
    note: data.note ?? '',
    createdAt: data.created_at,
  } as Transaction;
}
