import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Transaction } from '../types/transaction';

type PeopleScreenProps = {
  transactions: Transaction[];
  onBack: () => void;
};

type PersonBalance = {
  name: string;
  lent: number;
  owed: number;
  net: number;
};

export function PeopleScreen({ transactions, onBack }: PeopleScreenProps) {
  const balances = transactions.reduce<Map<string, PersonBalance>>((map, item) => {
    const key = item.person.trim().toLowerCase();
    const current = map.get(key) ?? { name: item.person, lent: 0, owed: 0, net: 0 };
    if (item.type === 'lent') current.lent += item.amount;
    else current.owed += item.amount;
    current.net = current.lent - current.owed;
    map.set(key, current);
    return map;
  }, new Map());

  const people = Array.from(balances.values()).sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={onBack}>
        <Text style={styles.back}>‹ Dashboard</Text>
      </Pressable>
      <Text style={styles.title}>People</Text>
      <Text style={styles.subtitle}>See your current balance with each person.</Text>

      {people.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No people yet</Text>
          <Text style={styles.emptyText}>Add a money record to start tracking someone.</Text>
        </View>
      ) : (
        people.map((person) => (
          <View style={styles.personCard} key={person.name.toLowerCase()}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{person.name.charAt(0).toUpperCase()}</Text></View>
            <View style={styles.main}>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.meta}>{person.lent > 0 ? `Lent ${formatCurrency(person.lent)}` : 'No money lent'} · {person.owed > 0 ? `Owe ${formatCurrency(person.owed)}` : 'Nothing owed'}</Text>
            </View>
            <View style={styles.amountBlock}>
              <Text style={[styles.amount, person.net < 0 && styles.negative]}>{person.net >= 0 ? '+' : '-'}{formatCurrency(Math.abs(person.net))}</Text>
              <Text style={styles.caption}>{person.net > 0 ? 'They owe you' : person.net < 0 ? 'You owe' : 'Settled'}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  back: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 28 },
  title: { fontSize: 30, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 15, lineHeight: 22, color: '#64748B', marginTop: 8, marginBottom: 22 },
  personCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 17, fontWeight: '800', color: '#334155' },
  main: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  meta: { fontSize: 11, lineHeight: 17, color: '#64748B', marginTop: 4 },
  amountBlock: { alignItems: 'flex-end', marginLeft: 8 },
  amount: { fontSize: 15, fontWeight: '800', color: '#15803D' },
  negative: { color: '#DC2626' },
  caption: { fontSize: 10, color: '#64748B', marginTop: 3 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 22, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  emptyText: { fontSize: 13, lineHeight: 20, color: '#64748B', marginTop: 6 },
});
