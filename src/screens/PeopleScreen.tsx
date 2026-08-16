import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { buildPeopleSummary } from '../domain/people';
import type { Transaction } from '../types/transaction';

type Props = {
  transactions: Transaction[];
};

const formatCurrency = (value: number) => `₹${Math.abs(value).toLocaleString('en-IN')}`;

export function PeopleScreen({ transactions }: Props) {
  const people = buildPeopleSummary(transactions);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>People</Text>
      <Text style={styles.subtitle}>See who owes you and who you owe.</Text>

      {people.map((person) => (
        <View style={styles.card} key={person.person}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{person.person.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{person.person}</Text>
            <Text style={styles.count}>{person.transactionCount} record{person.transactionCount === 1 ? '' : 's'}</Text>
          </View>
          <View style={styles.balanceBlock}>
            <Text style={[styles.balance, person.balance < 0 && styles.negative]}>
              {person.balance >= 0 ? '+' : '-'}{formatCurrency(person.balance)}
            </Text>
            <Text style={styles.balanceLabel}>{person.balance >= 0 ? 'They owe you' : 'You owe'}</Text>
          </View>
        </View>
      ))}

      {people.length === 0 && <Text style={styles.empty}>No people added yet.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 6, marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 14, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#334155' },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  count: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  balanceBlock: { alignItems: 'flex-end' },
  balance: { fontSize: 15, fontWeight: '800', color: '#15803D' },
  negative: { color: '#DC2626' },
  balanceLabel: { fontSize: 10, color: '#64748B', marginTop: 3 },
  empty: { color: '#94A3B8', textAlign: 'center', marginTop: 40 },
});
