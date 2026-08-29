import { Linking } from 'react-native';
import { supabase } from '../lib/supabaseClient';

function getHashParams(url: string): Record<string, string> {
  const hash = url.split('#')[1] ?? '';
  return Object.fromEntries(hash.split('&').filter(Boolean).map((part) => {
    const [key, value = ''] = part.split('=');
    return [decodeURIComponent(key), decodeURIComponent(value.replace(/\+/g, ' '))];
  }));
}

async function handleAuthDeepLink(url: string | null) {
  if (!supabase || !url || !url.startsWith('owemate://')) return;
  const params = getHashParams(url);
  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;
  if (!accessToken || !refreshToken) return;
  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
}

if (supabase) {
  void Linking.getInitialURL().then(handleAuthDeepLink).catch(() => undefined);
  Linking.addEventListener('url', ({ url }) => { void handleAuthDeepLink(url).catch(() => undefined); });
}

export async function signUp(email: string, password: string, fullName = '') {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  return supabase.auth.signUp({
    email,
    password,
    options: { data: fullName ? { full_name: fullName } : {} },
  });
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function sendPasswordReset(email: string) {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  return supabase.auth.resetPasswordForEmail(email, { redirectTo: 'owemate://reset-password' });
}

export async function updatePassword(password: string) {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  return supabase.auth.updateUser({ password });
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase is not configured yet.');
  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}
