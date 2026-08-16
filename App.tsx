import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AddTransactionScreen } from './src/screens/AddTransactionScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PeopleScreen } from './src/screens/PeopleScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { useAppRootState } from './src/screens/AppRoot';

export default function App() {
  return <SafeAreaProvider><AppContent /></SafeAreaProvider>;
}

function AppContent() {
  const app = useAppRootState();

  if (app.loading) {
    return <AppShell><View style={styles.loading}><ActivityIndicator size="large" color="#0F766E" /><Text style={styles.loadingText}>Loading OweMate…</Text></View></AppShell>;
  }

  if (app.screen === 'welcome') {
    return <AppShell><WelcomeScreen onSignIn={() => { app.clearMessage(); app.setScreen('signin'); }} onSignUp={() => { app.clearMessage(); app.setScreen('signup'); }} /></AppShell>;
  }

  if (app.screen === 'signin' || app.screen === 'signup') {
    return <AppShell><AuthScreen mode={app.screen} email={app.email} password={app.password} submitting={app.authSubmitting} configured={app.configured} message={app.message?.text ?? null} messageType={app.message?.type ?? 'error'} onEmailChange={app.setEmail} onPasswordChange={app.setPassword} onSubmit={() => void app.handleAuth()} onBack={() => { app.clearMessage(); app.setScreen('welcome'); }} /></AppShell>;
  }

  if (app.screen === 'add') {
    return <AppShell><AddTransactionScreen entryType={app.entryType} person={app.person} amount={app.amount} dueDate={app.dueDate} note={app.note} saving={app.saving} message={app.message?.text ?? null} onEntryTypeChange={app.setEntryType} onPersonChange={app.setPerson} onAmountChange={app.setAmount} onDueDateChange={app.setDueDate} onNoteChange={app.setNote} onSave={() => void app.handleSaveTransaction()} onBack={() => { app.clearMessage(); app.setScreen('dashboard'); }} /></AppShell>;
  }

  if (app.screen === 'people') {
    return <AppShell><PeopleScreen transactions={app.transactions} onBack={() => app.setScreen('dashboard')} /></AppShell>;
  }

  return <AppShell><DashboardScreen transactions={app.transactions} onAdd={() => { app.clearMessage(); app.setScreen('add'); }} onPeople={() => app.setScreen('people')} onSignOut={() => void app.handleSignOut()} /></AppShell>;
}

function AppShell({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}><StatusBar style="dark" />{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#64748B', fontSize: 14 },
});
