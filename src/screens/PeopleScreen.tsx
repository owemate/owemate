import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { buildPeopleSummary } from '../domain/people';
import { formatCurrency } from '../utils/currency';
import type { Transaction } from '../types/transaction';

type Props = { transactions: Transaction[]; onBack: () => void };

export function PeopleScreen({ transactions, onBack }: Props) {
  const people = buildPeopleSummary(transactions);
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹  Dashboard</Text></Pressable>
      <View style={styles.titleRow}><View><Text style={styles.eyebrow}>CONTACTS</Text><Text style={styles.title}>People</Text><Text style={styles.subtitle}>See who owes you and who you owe.</Text></View><View style={styles.count}><Text style={styles.countText}>{people.length}</Text></View></View>
      {people.map((person) => (
        <View style={styles.card} key={person.person}>
          <View style={[styles.avatar, person.balance < 0 && styles.avatarOwed]}><Text style={styles.avatarText}>{person.person.charAt(0).toUpperCase()}</Text></View>
          <View style={styles.details}><Text style={styles.name}>{person.person}</Text><Text style={styles.records}>{person.transactionCount} record{person.transactionCount === 1 ? '' : 's'}</Text></View>
          <View style={styles.balanceBlock}><Text style={[styles.balance, person.balance < 0 && styles.negative]}>{person.balance >= 0 ? '+' : '-'}{formatCurrency(person.balance)}</Text><Text style={styles.balanceLabel}>{person.balance > 0 ? 'They owe you' : person.balance < 0 ? 'You owe' : 'Settled'}</Text></View>
        </View>
      ))}
      {people.length === 0 && <View style={styles.empty}><View style={styles.emptyIcon}><Text style={styles.emptyIconText}>◎</Text></View><Text style={styles.emptyTitle}>No people yet</Text><Text style={styles.emptyText}>People will appear here as you add money records.</Text></View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34 },
  back: { color: '#4F635F', fontSize: 15, fontWeight: '700', marginBottom: 26 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  eyebrow: { color: '#0F766E', fontSize: 10, fontWeight: '900', letterSpacing: 1.3, marginBottom: 5 },
  title: { fontSize: 29, fontWeight: '900', color: '#10201D' },
  subtitle: { fontSize: 13, color: '#7A8A87', marginTop: 4 },
  count: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#D9F2ED', alignItems: 'center', justifyContent: 'center' },
  countText: { color: '#0F766E', fontSize: 12, fontWeight: '900' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1EAE7', borderRadius: 18, padding: 14, marginBottom: 9 },
  avatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#D9F2ED', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarOwed: { backgroundColor: '#FCE7E7' },
  avatarText: { fontSize: 17, fontWeight: '900', color: '#0F766E' },
  details: { flex: 1 },
  name: { fontSize: 15, fontWeight: '900', color: '#10201D' },
  records: { fontSize: 11, color: '#8A9A96', marginTop: 3 },
  balanceBlock: { alignItems: 'flex-end' },
  balance: { fontSize: 14, fontWeight: '900', color: '#16806F' },
  negative: { color: '#C24141' },
  balanceLabel: { fontSize: 9, color: '#7A8A87', marginTop: 3 },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E1EAE7', padding: 28, alignItems: 'center', marginTop: 8 },
  emptyIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#EAF5F2', alignItems: 'center', justifyContent: 'center' },
  emptyIconText: { color: '#0F766E', fontSize: 22, fontWeight: '800' },
  emptyTitle: { color: '#10201D', fontSize: 16, fontWeight: '900', marginTop: 12 },
  emptyText: { color: '#7A8A87', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 5 },
});
