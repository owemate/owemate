import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';
import type { TransactionType } from '../types/transaction';
import { parseUserDate } from '../utils/date';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedDate = useMemo(() => parseUserDate(dueDate) ?? new Date(), [dueDate]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed' || !date) return;
    onDueDateChange(date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  };

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹  Dashboard</Text></Pressable>
        <View style={styles.titleRow}><View><Text style={styles.eyebrow}>NEW RECORD</Text><Text style={styles.title}>Add money record</Text></View><View style={styles.iconBadge}><Text style={styles.iconText}>₹</Text></View></View>
        <Text style={styles.subtitle}>Track a personal money entry and its repayment date. OweMate is not a loan application.</Text>

        {message && <View style={styles.message}><Text style={styles.messageText}>{message}</Text></View>}

        <View style={styles.card}>
          <Text style={styles.label}>What happened?</Text>
          <View style={styles.segmented}>
            <Pressable style={[styles.segment, entryType === 'lent' && styles.activeSegment]} onPress={() => onEntryTypeChange('lent')}><Text style={[styles.segmentText, entryType === 'lent' && styles.activeText]}>I lent money</Text></Pressable>
            <Pressable style={[styles.segment, entryType === 'owed' && styles.activeSegment]} onPress={() => onEntryTypeChange('owed')}><Text style={[styles.segmentText, entryType === 'owed' && styles.activeText]}>I owe money</Text></Pressable>
          </View>

          <Text style={styles.label}>Person</Text>
          <TextInput value={person} onChangeText={onPersonChange} placeholder="e.g. Aarav" placeholderTextColor="#9AA7A5" style={styles.input} returnKeyType="next" />
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInput}><Text style={styles.currency}>₹</Text><TextInput value={amount} onChangeText={onAmountChange} placeholder="0" placeholderTextColor="#9AA7A5" keyboardType="decimal-pad" style={styles.amountField} /></View>
          <Text style={styles.label}>Commitment / repayment date</Text>
          <Pressable style={styles.dateField} onPress={() => setShowDatePicker(true)}>
            <View><Text style={styles.dateValue}>{dueDate || 'Choose a date'}</Text><Text style={styles.dateHint}>Tap to open the native calendar</Text></View>
            <Text style={styles.calendarIcon}>▣</Text>
          </Pressable>
          {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display={Platform.OS === 'ios' ? 'compact' : 'calendar'} minimumDate={new Date()} onChange={handleDateChange} />}
          <Text style={styles.label}>Note <Text style={styles.optional}>(optional)</Text></Text>
          <TextInput value={note} onChangeText={onNoteChange} placeholder="What was this for?" placeholderTextColor="#9AA7A5" style={[styles.input, styles.multiline]} multiline textAlignVertical="top" />
        </View>

        <Pressable style={[styles.button, saving && styles.disabled]} onPress={onSave} disabled={saving}><Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save record'}</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 44 },
  back: { color: '#4F635F', fontSize: 15, fontWeight: '700', marginBottom: 22 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: '#0F766E', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 6 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: '#10201D' },
  iconBadge: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#D9F2ED', alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#0F766E', fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 14, lineHeight: 21, color: '#6B7D79', marginTop: 10, marginBottom: 18 },
  message: { backgroundColor: '#FFF1F2', borderRadius: 14, padding: 13, marginBottom: 14 },
  messageText: { color: '#7F1D1D', fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#E2EAE8', shadowColor: '#17312C', shadowOpacity: 0.05, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 2 },
  label: { fontSize: 13, fontWeight: '800', color: '#30433F', marginBottom: 8, marginTop: 8 },
  optional: { color: '#9AA7A5', fontWeight: '600' },
  segmented: { flexDirection: 'row', backgroundColor: '#EEF3F1', borderRadius: 14, padding: 4, marginBottom: 10 },
  segment: { flex: 1, minHeight: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  activeSegment: { backgroundColor: '#0F766E', shadowColor: '#0F766E', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  segmentText: { color: '#60726E', fontSize: 13, fontWeight: '800' },
  activeText: { color: '#FFFFFF' },
  input: { minHeight: 52, borderWidth: 1, borderColor: '#D6E1DE', borderRadius: 14, paddingHorizontal: 15, fontSize: 16, color: '#10201D', backgroundColor: '#FBFCFC', marginBottom: 8 },
  amountInput: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BFD8D2', borderRadius: 14, backgroundColor: '#F8FCFB', marginBottom: 8, paddingHorizontal: 15 },
  currency: { fontSize: 22, fontWeight: '800', color: '#0F766E', marginRight: 8 },
  amountField: { flex: 1, fontSize: 23, fontWeight: '800', color: '#10201D', paddingVertical: 10 },
  dateField: { minHeight: 58, borderWidth: 1, borderColor: '#D6E1DE', borderRadius: 14, backgroundColor: '#FBFCFC', paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dateValue: { color: '#10201D', fontSize: 15, fontWeight: '700' },
  dateHint: { color: '#8A9A96', fontSize: 11, marginTop: 3 },
  calendarIcon: { color: '#0F766E', fontSize: 20 },
  multiline: { minHeight: 94, paddingTop: 14 },
  button: { minHeight: 56, borderRadius: 16, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 16, shadowColor: '#0F766E', shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 7 }, elevation: 3 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  buttonArrow: { color: '#FFFFFF', fontSize: 20, marginLeft: 10 },
});
