import type { Transaction } from '../types/transaction';
import { supabase } from '../lib/supabase';

function toDatabaseDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'No date set') return null;

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

  const match = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const fallback = new Date(`${month} ${day}, ${year} 12:00:00`);
  if (Number.isNaN(fallback.getTime())) return null;
  return fallback.toISOString().slice(0, 10);
}

function fromDatabaseDate(value: string | null): string {
  if (!value) return 'No date set';
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

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
    dueDate: fromDatabaseDate(row.due_date),
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
      due_date: toDatabaseDate(transaction.dueDate),
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
    dueDate: fromDatabaseDate(data.due_date),
    note: data.note ?? '',
    createdAt: data.created_at,
  } as Transaction;
}
