import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';
import type { TransactionType } from '../types/transaction';
import { formatDatabaseDate, parseUserDate } from '../utils/date';

type Props = {
  entryType: TransactionType;
  person: string;
  amount: string;
  dueDate: string;
  note: string;
  saving: boolean;
  message: string | null;
  reminderEnabled: boolean;
  onReminderChange: (value: boolean) => void;
  onEntryTypeChange: (type: TransactionType) => void;
  onPersonChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
};

export function AddTransactionScreen({ entryType, person, amount, dueDate, note, saving, message, reminderEnabled, onReminderChange, onEntryTypeChange, onPersonChange, onAmountChange, onDueDateChange, onNoteChange, onSave, onBack }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedDate = useMemo(() => parseUserDate(dueDate) ?? new Date(), [dueDate]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed' || !date) return;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onDueDateChange(`${year}-${month}-${day}`);
  };

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack} hitSlop={8}><Ionicons name="arrow-back" size={20} color="#0B1C30" /></Pressable>
          <Text style={styles.headerTitle}>Add Transaction</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
          {message && <View style={styles.message}><Text style={styles.messageText}>{message}</Text></View>}
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Person / Contact</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color="#BCC9C6" style={styles.leftIcon} />
                <TextInput value={person} onChangeText={onPersonChange} placeholder="Select or enter name" placeholderTextColor="#BCC9C6" style={styles.inputWithIcon} returnKeyType="next" />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountInput}>
                <Text style={styles.amountCurrency}>₹</Text>
                <TextInput value={amount} onChangeText={onAmountChange} placeholder="0.00" placeholderTextColor="#BCC9C6" keyboardType="decimal-pad" style={styles.amountField} />
              </View>
            </View>

            <View style={[styles.field, styles.sectionField]}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.segmented}>
                <Pressable style={[styles.segment, entryType === 'lent' && styles.segmentSelected]} onPress={() => onEntryTypeChange('lent')}><Text style={[styles.segmentText, entryType === 'lent' && styles.segmentSelectedText]}>I Lent</Text></Pressable>
                <Pressable style={[styles.segment, entryType === 'owed' && styles.segmentSelected]} onPress={() => onEntryTypeChange('owed')}><Text style={[styles.segmentText, entryType === 'owed' && styles.segmentSelectedText]}>I Borrowed</Text></Pressable>
              </View>
            </View>

            <View style={[styles.field, styles.sectionField]}>
              <Text style={styles.label}>Due Date</Text>
              <Pressable style={styles.inputWrap} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={19} color="#BCC9C6" style={styles.leftIcon} />
                <Text style={[styles.dateText, !dueDate && styles.placeholder]}>{dueDate ? formatDatabaseDate(dueDate) : 'mm/dd/yyyy'}</Text>
                <Ionicons name="chevron-down" size={15} color="#7A8A87" />
              </Pressable>
              {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display={Platform.OS === 'ios' ? 'compact' : 'calendar'} minimumDate={new Date()} onChange={handleDateChange} />}
            </View>

            <View style={[styles.field, styles.sectionField]}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput value={note} onChangeText={onNoteChange} placeholder="Add notes" placeholderTextColor="#BCC9C6" style={[styles.input, styles.notes]} multiline textAlignVertical="top" />
            </View>

            <View style={styles.reminderRow}>
              <Text style={styles.reminderLabel}>Reminder</Text>
              <Switch value={reminderEnabled} onValueChange={onReminderChange} trackColor={{ false: '#D3E4FE', true: '#B6DDD7' }} thumbColor={reminderEnabled ? '#00685F' : '#6D7A77'} ios_backgroundColor="#D3E4FE" />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={[styles.saveButton, saving && styles.disabled]} onPress={onSave} disabled={saving}>
            <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
            <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save Transaction'}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: '#F8F9FF' },
  screen: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { height: 72, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8F9FF', shadowColor: '#64748B', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF4FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#0B1C30', fontSize: 20, lineHeight: 28, fontWeight: '700' },
  headerSpacer: { width: 40, height: 40 },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 128 },
  message: { backgroundColor: '#FFF1F2', borderRadius: 8, padding: 12, marginBottom: 12 },
  messageText: { color: '#7F1D1D', fontSize: 13, lineHeight: 18 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, gap: 16, shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  field: { width: '100%' },
  sectionField: { paddingTop: 8 },
  label: { color: '#3D4947', fontSize: 14, lineHeight: 20, marginBottom: 4, fontWeight: '400' },
  inputWrap: { minHeight: 42, borderWidth: 1, borderColor: '#BCC9C6', borderRadius: 8, backgroundColor: '#F8F9FF', paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center' },
  leftIcon: { marginRight: 9 },
  inputWithIcon: { flex: 1, minHeight: 22, color: '#0B1C30', fontSize: 16, paddingVertical: 0 },
  input: { minHeight: 42, borderWidth: 1, borderColor: '#BCC9C6', borderRadius: 8, backgroundColor: '#F8F9FF', paddingHorizontal: 17, paddingVertical: 9, color: '#0B1C30', fontSize: 16 },
  amountInput: { height: 62, borderWidth: 1, borderColor: '#BCC9C6', borderRadius: 8, backgroundColor: '#F8F9FF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  amountCurrency: { color: '#0B1C30', fontSize: 20, fontWeight: '700', marginRight: 12 },
  amountField: { flex: 1, color: '#0B1C30', fontSize: 20, fontWeight: '600', paddingVertical: 0 },
  segmented: { backgroundColor: '#EFF4FF', borderRadius: 8, padding: 4, flexDirection: 'row' },
  segment: { flex: 1, minHeight: 40, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  segmentSelected: { backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  segmentText: { color: '#3D4947', fontSize: 16, lineHeight: 24 },
  segmentSelectedText: { color: '#00685F', fontWeight: '600' },
  dateText: { flex: 1, color: '#0B1C30', fontSize: 16, lineHeight: 24 },
  placeholder: { color: '#0B1C30' },
  notes: { minHeight: 90, paddingTop: 9 },
  reminderRow: { paddingTop: 8, minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reminderLabel: { color: '#0B1C30', fontSize: 16, lineHeight: 24 },
  footer: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 28 : 20, shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: -4 }, elevation: 6 },
  saveButton: { minHeight: 56, borderRadius: 9999, backgroundColor: '#00685F', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  saveText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24, fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
