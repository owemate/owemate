import type { Transaction } from '../types/transaction';
import { supabase } from '../lib/supabaseClient';
import { formatDatabaseDate, toDatabaseDate } from '../utils/date';

const SELECT_FIELDS = 'id, person, amount, type, status, due_date, note, created_at';

function mapRow(row: { id: string; person: string; amount: number | string; type: Transaction['type']; status?: Transaction['status']; due_date: string | null; note: string | null; created_at: string }): Transaction {
  return {
    id: row.id,
    person: row.person,
    amount: Number(row.amount),
    type: row.type,
    status: row.status ?? 'pending',
    dueDate: formatDatabaseDate(row.due_date),
    note: row.note ?? '',
    createdAt: row.created_at,
  };
}

export async function fetchCloudTransactions(userId: string): Promise<Transaction[]> {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  const { data, error } = await supabase.from('transactions').select(SELECT_FIELDS).eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row));
}

export async function createCloudTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'createdAt' | 'status'>): Promise<Transaction> {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  const { data, error } = await supabase.from('transactions').insert({ user_id: userId, person: transaction.person, amount: transaction.amount, type: transaction.type, status: 'pending', due_date: toDatabaseDate(transaction.dueDate), note: transaction.note || null }).select(SELECT_FIELDS).single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateTransactionStatus(userId: string, transactionId: string, status: Transaction['status']): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  const { error } = await supabase.from('transactions').update({ status }).eq('id', transactionId).eq('user_id', userId);
  if (error) throw error;
}

export async function deleteCloudTransaction(userId: string, transactionId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  const { error } = await supabase.from('transactions').delete().eq('id', transactionId).eq('user_id', userId);
  if (error) throw error;
}
