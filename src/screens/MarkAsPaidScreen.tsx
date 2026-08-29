import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/currency';

function todayLabel() {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

type Props = {
  transaction: Transaction;
  onBack: () => void;
  onConfirm: () => void;
};

export function MarkAsPaidScreen({ transaction, onBack, onConfirm }: Props) {
  const [paymentDate] = useState(todayLabel());
  const [note, setNote] = useState('');

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#0B1C30" />
        </Pressable>
        <Text style={styles.headerTitle}>Mark as Paid</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={30} color="#00685F" />
        </View>
        <Text style={styles.title}>Payment received?</Text>
        <Text style={styles.subtitle}>Confirm the payment details for this transaction.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{transaction.person.charAt(0).toUpperCase()}</Text></View>
            <View style={styles.personBlock}>
              <Text style={styles.personName}>{transaction.person}</Text>
              <Text style={styles.personMeta}>{transaction.type === 'lent' ? 'Money you lent' : 'Money you owed'}</Text>
            </View>
          </View>
          <View style={styles.amountDivider} />
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
        </View>

        <Text style={styles.label}>Payment date</Text>
        <View style={styles.inputShell}>
          <Ionicons name="calendar-outline" size={19} color="#00685F" />
          <Text style={styles.inputText}>{paymentDate}</Text>
        </View>

        <Text style={styles.label}>Payment note <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Add a note about this payment"
          placeholderTextColor="#9AA7A5"
          multiline
          textAlignVertical="top"
          style={styles.noteInput}
        />
        <Text style={styles.helper}>Payment date and note are shown for confirmation in this MVP. The transaction will be marked as paid.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.confirmButton} onPress={onConfirm}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.confirmText}>Confirm Payment</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { height: 64, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEF1F7' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0B1C30' },
  headerSpacer: { width: 40 },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 112 },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E0F2EE', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  title: { marginTop: 16, textAlign: 'center', fontSize: 24, lineHeight: 32, fontWeight: '800', color: '#0B1C30' },
  subtitle: { marginTop: 6, textAlign: 'center', fontSize: 14, lineHeight: 21, color: '#6D7A77' },
  summaryCard: { marginTop: 28, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  summaryTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DCE9FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#00685F' },
  personBlock: { marginLeft: 12, flex: 1 },
  personName: { fontSize: 17, fontWeight: '800', color: '#0B1C30' },
  personMeta: { marginTop: 2, fontSize: 13, color: '#6D7A77' },
  amountDivider: { height: 1, backgroundColor: '#E7ECEB', marginVertical: 16 },
  amountLabel: { fontSize: 13, color: '#6D7A77' },
  amount: { marginTop: 3, fontSize: 28, fontWeight: '800', color: '#00685F' },
  label: { marginTop: 22, marginBottom: 8, fontSize: 14, fontWeight: '700', color: '#0B1C30' },
  optional: { color: '#8A9693', fontWeight: '500' },
  inputShell: { height: 52, borderWidth: 1, borderColor: '#BCC9C6', borderRadius: 10, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  inputText: { fontSize: 16, color: '#0B1C30' },
  noteInput: { minHeight: 100, borderWidth: 1, borderColor: '#BCC9C6', borderRadius: 10, backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, lineHeight: 22, color: '#0B1C30' },
  helper: { marginTop: 8, fontSize: 12, lineHeight: 18, color: '#8A9693' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF1F7' },
  confirmButton: { height: 52, borderRadius: 12, backgroundColor: '#00685F', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  confirmText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
