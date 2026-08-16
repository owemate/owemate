import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Screen = 'welcome' | 'signin' | 'signup' | 'dashboard' | 'add';
type EntryType = 'lent' | 'owed';

type Transaction = {
  id: string;
  person: string;
  amount: number;
  type: EntryType;
  dueDate: string;
  note: string;
};

const initialTransactions: Transaction[] = [
  { id: '1', person: 'Aarav', amount: 2500, type: 'lent', dueDate: '28 Aug 2026', note: 'Dinner & travel' },
  { id: '2', person: 'Priya', amount: 1200, type: 'owed', dueDate: '02 Sep 2026', note: 'Shared shopping' },
  { id: '3', person: 'Rohan', amount: 800, type: 'lent', dueDate: '10 Sep 2026', note: 'Tickets' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [entryType, setEntryType] = useState<EntryType>('lent');
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  const totalLent = transactions.filter((item) => item.type === 'lent').reduce((sum, item) => sum + item.amount, 0);
  const totalOwed = transactions.filter((item) => item.type === 'owed').reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalLent - totalOwed;

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  const resetEntry = () => {
    setPerson('');
    setAmount('');
    setDueDate('');
    setNote('');
    setEntryType('lent');
  };

  const saveTransaction = () => {
    const numericAmount = Number(amount.replace(/,/g, ''));
    if (!person.trim() || !numericAmount || numericAmount <= 0) return;

    setTransactions((current) => [
      {
        id: Date.now().toString(),
        person: person.trim(),
        amount: numericAmount,
        type: entryType,
        dueDate: dueDate.trim() || 'No date set',
        note: note.trim() || 'No note',
      },
      ...current,
    ]);
    resetEntry();
    setScreen('dashboard');
  };

  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <View style={styles.brandBlock}>
            <View style={styles.logoCircle}><Text style={styles.logoMark}>O</Text></View>
            <Text style={styles.logo}>OweMate</Text>
            <Text style={styles.title}>Know who owes whom.</Text>
            <Text style={styles.subtitle}>Keep track of money you lend or owe to people you know — simply and privately.</Text>
          </View>
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => setScreen('signin')}><Text style={styles.primaryButtonText}>Sign in</Text></Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => setScreen('signup')}><Text style={styles.secondaryButtonText}>Create account</Text></Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'signin' || screen === 'signup') {
    const isSignIn = screen === 'signin';
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.formContainer}>
            <Pressable onPress={() => setScreen('welcome')}><Text style={styles.backButton}>‹ Back</Text></Pressable>
            <Text style={styles.formTitle}>{isSignIn ? 'Welcome back' : 'Create your account'}</Text>
            <Text style={styles.formSubtitle}>{isSignIn ? 'Sign in to continue to OweMate.' : 'Start keeping track of your money with OweMate.'}</Text>
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#94A3B8" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
              <Text style={styles.label}>Password</Text>
              <TextInput value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor="#94A3B8" secureTextEntry style={styles.input} />
              <Pressable style={styles.primaryButton} onPress={() => setScreen('dashboard')}><Text style={styles.primaryButtonText}>{isSignIn ? 'Sign in' : 'Create account'}</Text></Pressable>
              <Text style={styles.demoHint}>Demo mode: authentication will be connected to the backend later.</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (screen === 'add') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Pressable onPress={() => setScreen('dashboard')}><Text style={styles.backButton}>‹ Dashboard</Text></Pressable>
            <Text style={styles.formTitle}>Add money record</Text>
            <Text style={styles.formSubtitle}>Record a simple peer-to-peer money entry. This is not a loan application.</Text>

            <View style={styles.segmentedControl}>
              <Pressable style={[styles.segment, entryType === 'lent' && styles.segmentActive]} onPress={() => setEntryType('lent')}>
                <Text style={[styles.segmentText, entryType === 'lent' && styles.segmentTextActive]}>I lent</Text>
              </Pressable>
              <Pressable style={[styles.segment, entryType === 'owed' && styles.segmentActive]} onPress={() => setEntryType('owed')}>
                <Text style={[styles.segmentText, entryType === 'owed' && styles.segmentTextActive]}>I owe</Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Person</Text>
              <TextInput value={person} onChangeText={setPerson} placeholder="e.g. Aarav" placeholderTextColor="#94A3B8" style={styles.input} />
              <Text style={styles.label}>Amount (₹)</Text>
              <TextInput value={amount} onChangeText={setAmount} placeholder="0" placeholderTextColor="#94A3B8" keyboardType="numeric" style={styles.input} />
              <Text style={styles.label}>Commitment / repayment date</Text>
              <TextInput value={dueDate} onChangeText={setDueDate} placeholder="e.g. 28 Aug 2026" placeholderTextColor="#94A3B8" style={styles.input} />
              <Text style={styles.label}>Note (optional)</Text>
              <TextInput value={note} onChangeText={setNote} placeholder="What was this for?" placeholderTextColor="#94A3B8" style={[styles.input, styles.multilineInput]} multiline />
              <Pressable style={styles.primaryButton} onPress={saveTransaction}><Text style={styles.primaryButtonText}>Save record</Text></Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.dashboard}>
        <View style={styles.headerRow}>
          <View><Text style={styles.greeting}>Good morning 👋</Text><Text style={styles.dashboardTitle}>Your money overview</Text></View>
          <View style={styles.smallLogo}><Text style={styles.smallLogoText}>O</Text></View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>Net balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(netBalance)}</Text>
          <Text style={styles.balanceCaption}>{netBalance >= 0 ? 'People owe you more than you owe.' : 'You owe more than people owe you.'}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}><Text style={styles.cardLabel}>You lent</Text><Text style={styles.summaryAmount}>{formatCurrency(totalLent)}</Text></View>
          <View style={styles.summaryCard}><Text style={styles.cardLabel}>You owe</Text><Text style={styles.summaryAmount}>{formatCurrency(totalOwed)}</Text></View>
        </View>

        <Pressable style={styles.addButton} onPress={() => setScreen('add')}><Text style={styles.addButtonText}>＋ Add money record</Text></Pressable>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Recent records</Text><Text style={styles.sectionCount}>{transactions.length}</Text></View>

        {transactions.map((item) => (
          <View style={styles.transactionCard} key={item.id}>
            <View style={styles.transactionIcon}><Text style={styles.transactionIconText}>{item.person.charAt(0).toUpperCase()}</Text></View>
            <View style={styles.transactionMain}>
              <Text style={styles.personName}>{item.person}</Text>
              <Text style={styles.transactionNote}>{item.note}</Text>
              <Text style={styles.dueText}>Due: {item.dueDate}</Text>
            </View>
            <View style={styles.amountBlock}>
              <Text style={[styles.transactionAmount, item.type === 'owed' && styles.owedAmount]}>{item.type === 'lent' ? '+' : '-'}{formatCurrency(item.amount)}</Text>
              <Text style={styles.typeText}>{item.type === 'lent' ? 'They owe you' : 'You owe'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardContainer: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between', padding: 24, paddingBottom: 32 },
  brandBlock: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoMark: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  logo: { fontSize: 34, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 25, color: '#64748B', textAlign: 'center', maxWidth: 350 },
  actions: { gap: 12 },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: { height: 54, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  secondaryButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  formContainer: { flex: 1, padding: 24 },
  backButton: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 36 },
  formTitle: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  formSubtitle: { fontSize: 16, lineHeight: 24, color: '#64748B', marginBottom: 28 },
  form: { gap: 10 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 8 },
  input: { height: 52, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#0F172A', backgroundColor: '#FFFFFF', marginBottom: 6 },
  multilineInput: { height: 90, paddingTop: 14, textAlignVertical: 'top' },
  demoHint: { color: '#94A3B8', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8 },
  dashboard: { padding: 20, paddingBottom: 36 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  greeting: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  dashboardTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  smallLogo: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  smallLogoText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  balanceCard: { backgroundColor: '#0F172A', borderRadius: 20, padding: 22, marginBottom: 14 },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  balanceCard: { backgroundColor: '#0F172A', borderRadius: 20, padding: 22, marginBottom: 14 },
  balanceAmount: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
  balanceCaption: { fontSize: 13, color: '#CBD5E1', marginTop: 7 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  summaryAmount: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginTop: 8 },
  addButton: { height: 54, borderRadius: 14, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  addButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionCount: { minWidth: 24, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 12, backgroundColor: '#E2E8F0', color: '#475569', fontSize: 12, textAlign: 'center', overflow: 'hidden' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  transactionIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transactionIconText: { fontSize: 16, fontWeight: '800', color: '#334155' },
  transactionMain: { flex: 1 },
  personName: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  transactionNote: { fontSize: 12, color: '#64748B', marginTop: 2 },
  dueText: { fontSize: 11, color: '#94A3B8', marginTop: 4 },
  amountBlock: { alignItems: 'flex-end', marginLeft: 8 },
  transactionAmount: { fontSize: 15, fontWeight: '800', color: '#15803D' },
  owedAmount: { color: '#DC2626' },
  typeText: { fontSize: 10, color: '#64748B', marginTop: 3 },
  segmentedControl: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 14, padding: 4, marginBottom: 18 },
  segment: { flex: 1, height: 46, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: '#FFFFFF' },
  segmentText: { color: '#64748B', fontSize: 15, fontWeight: '700' },
  segmentTextActive: { color: '#0F172A' },
});
