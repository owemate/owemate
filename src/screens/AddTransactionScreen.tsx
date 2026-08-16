import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TransactionType } from '../types/transaction';

type Props = {
  entryType: TransactionType;
  person: string;
  amount: string;
  dueDate: string;
  note: string;
  saving: boolean;
  message: string | null;
  onEntryTypeChange: (type: TransactionType) => void;
  onPersonChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
};

export function AddTransactionScreen({ entryType, person, amount, dueDate, note, saving, message, onEntryTypeChange, onPersonChange, onAmountChange, onDueDateChange, onNoteChange, onSave, onBack }: Props) {
  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack}><Text style={styles.back}>‹ Dashboard</Text></Pressable>
        <Text style={styles.title}>Add money record</Text>
        <Text style={styles.subtitle}>Record a simple peer-to-peer money entry. This is not a loan application.</Text>

        {message && <View style={styles.message}><Text style={styles.messageText}>{message}</Text></View>}

        <View style={styles.segmented}>
          <Pressable style={[styles.segment, entryType === 'lent' && styles.activeSegment]} onPress={() => onEntryTypeChange('lent')}><Text style={[styles.segmentText, entryType === 'lent' && styles.activeText]}>I lent</Text></Pressable>
          <Pressable style={[styles.segment, entryType === 'owed' && styles.activeSegment]} onPress={() => onEntryTypeChange('owed')}><Text style={[styles.segmentText, entryType === 'owed' && styles.activeText]}>I owe</Text></Pressable>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Person</Text>
          <TextInput value={person} onChangeText={onPersonChange} placeholder="e.g. Aarav" placeholderTextColor="#94A3B8" style={styles.input} />
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput value={amount} onChangeText={onAmountChange} placeholder="0" placeholderTextColor="#94A3B8" keyboardType="numeric" style={styles.input} />
          <Text style={styles.label}>Commitment / repayment date</Text>
          <TextInput value={dueDate} onChangeText={onDueDateChange} placeholder="e.g. 28 Aug 2026" placeholderTextColor="#94A3B8" style={styles.input} />
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput value={note} onChangeText={onNoteChange} placeholder="What was this for?" placeholderTextColor="#94A3B8" style={[styles.input, styles.multiline]} multiline />
          <Pressable style={[styles.button, saving && styles.disabled]} onPress={onSave} disabled={saving}><Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save record'}</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  container: { padding: 24, paddingBottom: 40 },
  back: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 36 },
  title: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#64748B', marginBottom: 28 },
  message: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 12, marginBottom: 16 },
  messageText: { color: '#334155', fontSize: 13, lineHeight: 19 },
  segmented: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 14, padding: 4, marginBottom: 18 },
  segment: { flex: 1, height: 46, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  activeSegment: { backgroundColor: '#FFFFFF' },
  segmentText: { color: '#64748B', fontSize: 15, fontWeight: '700' },
  activeText: { color: '#0F172A' },
  form: { gap: 10 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 8 },
  input: { height: 52, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#0F172A', backgroundColor: '#FFFFFF', marginBottom: 6 },
  multiline: { height: 90, paddingTop: 14, textAlignVertical: 'top' },
  button: { height: 54, borderRadius: 14, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
