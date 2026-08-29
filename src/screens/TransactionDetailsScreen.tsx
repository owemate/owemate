import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/currency';
import { formatDatabaseDate } from '../utils/date';

type Props = {
  transaction: Transaction;
  onBack: () => void;
  onMarkPaid: () => void;
  onDelete: () => void;
};

export function TransactionDetailsScreen({ transaction, onBack, onMarkPaid, onDelete }: Props) {
  const paid = transaction.status === 'settled';
  const typeLabel = transaction.type === 'lent' ? 'I Lent' : 'I Borrowed';
  const dateLabel = transaction.dueDate === 'No date set' ? 'Not set' : formatDatabaseDate(transaction.dueDate);
  const initials = transaction.person.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={onBack}><Ionicons name="arrow-back" size={20} color="#0B1C30" /></Pressable>
        <Pressable style={styles.iconButton} onPress={() => Alert.alert('Transaction options', 'More options will be added in the next update.')}><Ionicons name="ellipsis-vertical" size={20} color="#0B1C30" /></Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.personRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          <Text style={styles.personName}>{transaction.person}</Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
          <View style={[styles.statusBadge, paid ? styles.statusPaid : styles.statusPending]}>
            <Text style={[styles.statusText, paid ? styles.statusTextPaid : styles.statusTextPending]}>{paid ? 'PAID' : 'PENDING'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <DetailRow label="Type" value={typeLabel} />
          <Divider />
          <DetailRow label={transaction.type === 'lent' ? 'Lent On' : 'Borrowed On'} value={formatDatabaseDate(transaction.createdAt)} />
          <Divider />
          <DetailRow label="Due Date" value={dateLabel} />
          <Divider />
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <View style={styles.notesBox}><Text style={styles.notesText}>{transaction.note === 'No note' ? 'No notes added' : transaction.note}</Text></View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.editButton} onPress={() => Alert.alert('Coming next', 'Editing an existing transaction will be added with the next pass.')}><Text style={styles.editText}>Edit</Text></Pressable>
          <Pressable style={[styles.paidButton, paid && styles.paidButtonDisabled]} disabled={paid} onPress={onMarkPaid}><Text style={styles.paidText}>{paid ? 'Marked as Paid' : 'Mark as Paid'}</Text></Pressable>
        </View>
        <Pressable style={styles.deleteButton} onPress={() => Alert.alert('Delete transaction?', 'This record will be permanently removed.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: onDelete }])}><Text style={styles.deleteText}>Delete</Text></Pressable>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

function Divider() { return <View style={styles.divider} />; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { height: 72, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF4FF', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  personRow: { height: 56, flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#DCE9FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#00685F' },
  personName: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: '#0B1C30' },
  amountRow: { minHeight: 81, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  amount: { fontSize: 36, lineHeight: 48, fontWeight: '800', color: '#0B1C30' },
  statusBadge: { borderRadius: 999, paddingHorizontal: 13, paddingVertical: 5 },
  statusPending: { backgroundColor: '#FFF4D6', borderWidth: 1, borderColor: '#E9C46A' },
  statusPaid: { backgroundColor: '#E0F2EE', borderWidth: 1, borderColor: '#9ACFC4' },
  statusText: { fontSize: 12, lineHeight: 16, fontWeight: '800', letterSpacing: 0.5 },
  statusTextPending: { color: '#8A5A00' },
  statusTextPaid: { color: '#00685F' },
  card: { marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  detailRow: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLabel: { color: '#6D7A77', fontSize: 14, lineHeight: 20 },
  detailValue: { color: '#0B1C30', fontSize: 16, lineHeight: 24, fontWeight: '600', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#E7ECEB', marginVertical: 8 },
  notesSection: { paddingTop: 8 },
  notesLabel: { color: '#6D7A77', fontSize: 14, lineHeight: 20 },
  notesBox: { marginTop: 8, minHeight: 42, borderRadius: 8, backgroundColor: '#F8F9FF', borderWidth: 1, borderColor: '#E1E8E6', paddingHorizontal: 9, paddingVertical: 9, justifyContent: 'center' },
  notesText: { color: '#0B1C30', fontSize: 15, lineHeight: 24 },
  actions: { marginTop: 24, flexDirection: 'row', gap: 16 },
  editButton: { flex: 1, height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#BCC9C6', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  editText: { color: '#0B1C30', fontSize: 14, fontWeight: '700' },
  paidButton: { flex: 1, height: 48, borderRadius: 10, backgroundColor: '#00685F', alignItems: 'center', justifyContent: 'center', shadowColor: '#00685F', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  paidButtonDisabled: { backgroundColor: '#8AA6A1' },
  paidText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  deleteButton: { marginTop: 16, height: 36, alignItems: 'center', justifyContent: 'center' },
  deleteText: { color: '#BA1A1A', fontSize: 14, fontWeight: '600' },
});
