import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '../utils/currency';
import type { Transaction } from '../types/transaction';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onPeople: () => void;
  onSignOut: () => void;
};

export function DashboardScreen({ transactions, onAdd, onPeople, onSignOut }: Props) {
  const lent = transactions.filter((item) => item.type === 'lent').reduce((sum, item) => sum + item.amount, 0);
  const owed = transactions.filter((item) => item.type === 'owed').reduce((sum, item) => sum + item.amount, 0);
  const net = lent - owed;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.title}>Your money overview</Text>
        </View>
        <Pressable style={styles.logo} onPress={onPeople}><Text style={styles.logoText}>O</Text></Pressable>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Net balance</Text>
        <Text style={styles.balance}>{formatCurrency(net)}</Text>
        <Text style={styles.balanceCaption}>{net >= 0 ? 'People owe you more than you owe.' : 'You owe more than people owe you.'}</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}><Text style={styles.cardLabel}>You lent</Text><Text style={styles.summaryAmount}>{formatCurrency(lent)}</Text></View>
        <View style={styles.summaryCard}><Text style={styles.cardLabel}>You owe</Text><Text style={styles.summaryAmount}>{formatCurrency(owed)}</Text></View>
      </View>

      <Pressable style={styles.addButton} onPress={onAdd}><Text style={styles.addButtonText}>＋ Add money record</Text></Pressable>
      <Pressable style={styles.peopleButton} onPress={onPeople}><Text style={styles.peopleButtonText}>View people</Text></Pressable>
      <Pressable style={styles.signOutButton} onPress={onSignOut}><Text style={styles.signOutText}>Sign out</Text></Pressable>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Recent records</Text><Text style={styles.sectionCount}>{transactions.length}</Text></View>
      {transactions.length === 0 ? (
        <View style={styles.emptyCard}><Text style={styles.emptyTitle}>No records yet</Text><Text style={styles.emptyText}>Add your first money record to start tracking.</Text></View>
      ) : transactions.map((item) => (
        <View style={styles.transactionCard} key={item.id}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{item.person.charAt(0).toUpperCase()}</Text></View>
          <View style={styles.transactionMain}>
            <Text style={styles.person}>{item.person}</Text>
            <Text style={styles.note}>{item.note}</Text>
            <Text style={styles.due}>Due: {item.dueDate}</Text>
          </View>
          <View style={styles.amountBlock}>
            <Text style={[styles.amount, item.type === 'owed' && styles.negative]}>{item.type === 'lent' ? '+' : '-'}{formatCurrency(item.amount)}</Text>
            <Text style={styles.type}>{item.type === 'lent' ? 'They owe you' : 'You owe'}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  headerText: { flex: 1 },
  greeting: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  logo: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  balanceCard: { backgroundColor: '#0F172A', borderRadius: 20, padding: 22, marginBottom: 14 },
  balanceLabel: { fontSize: 13, fontWeight: '600', color: '#CBD5E1' },
  balance: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
  balanceCaption: { fontSize: 13, color: '#CBD5E1', marginTop: 7 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  summaryAmount: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginTop: 8 },
  addButton: { height: 54, borderRadius: 14, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  addButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
  peopleButton: { height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  peopleButtonText: { color: '#334155', fontSize: 15, fontWeight: '700' },
  signOutButton: { height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  signOutText: { color: '#DC2626', fontSize: 14, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionCount: { minWidth: 24, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 12, backgroundColor: '#E2E8F0', color: '#475569', fontSize: 12, textAlign: 'center', overflow: 'hidden' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#334155' },
  transactionMain: { flex: 1 },
  person: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  note: { fontSize: 12, color: '#64748B', marginTop: 2 },
  due: { fontSize: 11, color: '#94A3B8', marginTop: 4 },
  amountBlock: { alignItems: 'flex-end', marginLeft: 8 },
  amount: { fontSize: 15, fontWeight: '800', color: '#15803D' },
  negative: { color: '#DC2626' },
  type: { fontSize: 10, color: '#64748B', marginTop: 3 },
  emptyCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 22, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  emptyText: { fontSize: 13, color: '#64748B', marginTop: 6, textAlign: 'center' },
});
