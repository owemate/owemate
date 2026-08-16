import { useEffect, useState } from 'react';
import type { Transaction, TransactionType } from '../types/transaction';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { signIn, signUp } from '../services/auth';
import { createCloudTransaction, deleteCloudTransaction, fetchCloudTransactions, updateTransactionStatus } from '../services/transactions';
import { scheduleDueDateReminder } from '../services/notifications';
import { isValidUserDate } from '../utils/date';

type Screen = 'welcome' | 'signin' | 'signup' | 'dashboard' | 'add' | 'people';
type Message = { type: 'error' | 'success'; text: string } | null;

export function useAppRootState() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [entryType, setEntryType] = useState<TransactionType>('lent');
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const client = supabase;
    const restoreSession = async () => {
      const { data } = await client.auth.getSession();
      if (active) setUserId(data.session?.user.id ?? null);
    };
    void restoreSession();
    const { data } = client.auth.onAuthStateChange((_event, session) => { if (active) setUserId(session?.user.id ?? null); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!userId) { setTransactions([]); setLoading(false); return; }
    const load = async () => {
      setLoading(true); setMessage(null);
      try { setTransactions(await fetchCloudTransactions(userId)); }
      catch (error) { setTransactions([]); setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not load your records.' }); }
      finally { setLoading(false); }
    };
    void load();
  }, [userId]);

  const clearMessage = () => setMessage(null);

  const handleAuth = async () => {
    clearMessage();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) { setMessage({ type: 'error', text: 'Enter your email and password.' }); return; }
    if (!isSupabaseConfigured) { setMessage({ type: 'error', text: 'Supabase is not configured in this local environment.' }); return; }
    setAuthSubmitting(true);
    try {
      const result = screen === 'signin' ? await signIn(cleanEmail, password) : await signUp(cleanEmail, password);
      if (result.error) throw result.error;
      if (result.data.session) { setScreen('dashboard'); setMessage({ type: 'success', text: screen === 'signin' ? 'Signed in successfully.' : 'Account created successfully.' }); }
      else setMessage({ type: 'success', text: 'Account created. Check your email if confirmation is enabled.' });
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Authentication failed.' }); }
    finally { setAuthSubmitting(false); }
  };

  const resetEntry = () => { setPerson(''); setAmount(''); setDueDate(''); setNote(''); setEntryType('lent'); };

  const handleSaveTransaction = async () => {
    clearMessage();
    const numericAmount = Number(amount.replace(/,/g, ''));
    const cleanDueDate = dueDate.trim();
    if (!userId) { setMessage({ type: 'error', text: 'Please sign in before adding a money record.' }); setScreen('signin'); return; }
    if (!person.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) { setMessage({ type: 'error', text: 'Enter a person and a valid amount.' }); return; }
    if (cleanDueDate && !isValidUserDate(cleanDueDate)) { setMessage({ type: 'error', text: 'Enter a valid commitment date, for example 28 Aug 2026.' }); return; }
    const draft = { person: person.trim(), amount: numericAmount, type: entryType, dueDate: cleanDueDate || 'No date set', note: note.trim() || 'No note' } satisfies Omit<Transaction, 'id' | 'createdAt' | 'status'>;
    setSaving(true);
    try {
      const transaction = await createCloudTransaction(userId, draft);
      setTransactions((current) => [transaction, ...current]);
      void scheduleDueDateReminder(transaction).catch(() => undefined);
      resetEntry(); setMessage({ type: 'success', text: 'Money record saved.' }); setScreen('dashboard');
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not save the record.' }); }
    finally { setSaving(false); }
  };

  const handleToggleSettled = async (transaction: Transaction) => {
    if (!userId) return;
    const nextStatus = transaction.status === 'settled' ? 'pending' : 'settled';
    try {
      await updateTransactionStatus(userId, transaction.id, nextStatus);
      setTransactions((current) => current.map((item) => item.id === transaction.id ? { ...item, status: nextStatus } : item));
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not update the record.' }); }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!userId) return;
    try {
      await deleteCloudTransaction(userId, transactionId);
      setTransactions((current) => current.filter((item) => item.id !== transactionId));
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not delete the record.' }); }
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUserId(null); setTransactions([]); setScreen('welcome'); clearMessage();
  };

  return { screen, setScreen, configured: isSupabaseConfigured, email, password, userId, transactions, loading, authSubmitting, saving, message, entryType, person, amount, dueDate, note, setEmail, setPassword, setEntryType, setPerson, setAmount, setDueDate, setNote, clearMessage, handleAuth, handleSaveTransaction, handleToggleSettled, handleDeleteTransaction, handleSignOut };
}
