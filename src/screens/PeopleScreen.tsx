import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/currency';
import { parseUserDate } from '../utils/date';
import type { Transaction } from '../types/transaction';

type Filter = 'all' | 'lent' | 'borrowed' | 'overdue' | 'paid';

type Props = {
  transactions: Transaction[];
  onBack: () => void;
  onSelectPerson: (person: string) => void;
};

function isOverdue(item: Transaction) {
  if (item.status === 'settled' || item.dueDate === 'No date set') return false;
  const date = parseUserDate(item.dueDate);
  if (!date) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() < today.getTime();
}

function dueLabel(item: Transaction) {
  if (item.status === 'settled') return 'Settled';
  if (item.dueDate === 'No date set') return 'No due date';
  const date = parseUserDate(item.dueDate);
  if (!date) return item.dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days < 8) return `Due in ${days} days`;
  return `Due ${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`;
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '?';
}

export function PeopleScreen({ transactions, onBack, onSelectPerson }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...transactions]
      .filter((item) => {
        if (normalized && !item.person.toLowerCase().includes(normalized) && !String(item.amount).includes(normalized)) return false;
        if (filter === 'lent') return item.type === 'lent' && item.status !== 'settled';
        if (filter === 'borrowed') return item.type === 'owed' && item.status !== 'settled';
        if (filter === 'overdue') return isOverdue(item);
        if (filter === 'paid') return item.status === 'settled';
        return true;
      })
      .sort((a, b) => {
        if (a.status === 'settled' && b.status !== 'settled') return 1;
        if (a.status !== 'settled' && b.status === 'settled') return -1;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [transactions, query, filter]);

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'lent', label: 'Lent' },
    { key: 'borrowed', label: 'Borrowed' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'paid', label: 'Paid' },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.brandAvatar} hitSlop={8}>
          <Text style={styles.brandAvatarText}>O</Text>
        </Pressable>
        <Text style={styles.brand}>OweMate</Text>
        <View style={styles.notification}><Ionicons name="notifications-outline" size={21} color="#00685F" /></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Transactions</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#6D7A77" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or amount..."
            placeholderTextColor="#A6B1B0"
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {tabs.map((tab) => {
            const active = filter === tab.key;
            const overdue = tab.key === 'overdue';
            return (
              <Pressable
                key={tab.key}
                onPress={() => setFilter(tab.key)}
                style={[styles.tab, active && styles.tabActive, overdue && !active && styles.tabOverdue]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive, overdue && !active && styles.tabTextOverdue]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={28} color="#6D7A77" />
              <Text style={styles.emptyTitle}>No transactions found</Text>
              <Text style={styles.emptyText}>Try another filter or add a new transaction.</Text>
            </View>
          ) : (
            filtered.map((item) => {
              const overdue = isOverdue(item);
              const paid = item.status === 'settled';
              const borrowed = item.type === 'owed';
              const rightLabel = paid ? 'PAID' : borrowed ? 'TO PAY' : 'LENT';
              return (
                <Pressable
                  key={item.id}
                  onPress={() => onSelectPerson(item.person)}
                  style={[styles.card, overdue && styles.cardOverdue, paid && styles.cardPaid]}
                >
                  <View style={styles.left}>
                    <View style={[styles.avatar, overdue && styles.avatarOverdue, paid && styles.avatarPaid]}>
                      <Text style={[styles.avatarText, overdue && styles.avatarTextOverdue]}>{initials(item.person)}</Text>
                    </View>
                    <View style={styles.personBlock}>
                      <Text numberOfLines={1} style={[styles.personName, paid && styles.personNamePaid]}>{item.person}</Text>
                      <View style={styles.metaRow}>
                        <Ionicons name={paid ? 'checkmark-circle-outline' : overdue ? 'warning-outline' : 'calendar-outline'} size={14} color={overdue ? '#BA1A1A' : '#6D7A77'} />
                        <Text style={[styles.meta, overdue && styles.metaOverdue]}>{dueLabel(item)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.right}>
                    <Text style={[styles.amount, (borrowed || overdue) && styles.amountPay, paid && styles.amountPaid]}>{formatCurrency(item.amount)}</Text>
                    <View style={[styles.badge, paid ? styles.badgePaid : borrowed || overdue ? styles.badgePay : styles.badgeLent]}>
                      <Text style={[styles.badgeText, paid ? styles.badgeTextPaid : borrowed || overdue ? styles.badgeTextPay : styles.badgeTextLent]}>{rightLabel}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={onBack}><Ionicons name="home-outline" size={20} color="#3D4947" /><Text style={styles.navText}>Home</Text></Pressable>
        <View style={[styles.navItem, styles.navActive]}><Ionicons name="list" size={20} color="#FFFFFF" /><Text style={styles.navTextActive}>Transactions</Text></View>
        <View style={styles.navItem}><Ionicons name="add-circle-outline" size={22} color="#3D4947" /><Text style={styles.navText}>Add</Text></View>
        <View style={styles.navItem}><Ionicons name="calendar-outline" size={20} color="#3D4947" /><Text style={styles.navText}>Calendar</Text></View>
        <View style={styles.navItem}><Ionicons name="person-outline" size={20} color="#3D4947" /><Text style={styles.navText}>Profile</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FF' },
  topBar: { height: 64, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEF1F7' },
  brandAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DCE9FF', alignItems: 'center', justifyContent: 'center' },
  brandAvatarText: { fontSize: 16, fontWeight: '800', color: '#00685F' },
  brand: { fontSize: 20, lineHeight: 28, fontWeight: '800', color: '#00685F', letterSpacing: -0.5 },
  notification: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingTop: 24, paddingBottom: 96 },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '800', color: '#0B1C30', marginBottom: 16 },
  searchBox: { height: 44, borderWidth: 1, borderColor: '#BCC9C6', borderRadius: 8, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  searchInput: { flex: 1, fontSize: 16, color: '#0B1C30', paddingVertical: 0 },
  tabs: { gap: 8, paddingVertical: 16, paddingRight: 20 },
  tab: { minHeight: 38, paddingHorizontal: 17, justifyContent: 'center', alignItems: 'center', borderRadius: 999, borderWidth: 1, borderColor: '#BCC9C6', backgroundColor: '#FFFFFF' },
  tabActive: { backgroundColor: '#00685F', borderColor: '#00685F', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  tabOverdue: { borderColor: '#FFDAD6' },
  tabText: { fontSize: 14, lineHeight: 20, color: '#3D4947' },
  tabTextActive: { color: '#FFFFFF' },
  tabTextOverdue: { color: '#BA1A1A' },
  list: { gap: 8 },
  card: { minHeight: 82, borderRadius: 12, backgroundColor: '#FFFFFF', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  cardOverdue: { borderWidth: 1, borderColor: 'rgba(186,26,26,0.20)' },
  cardPaid: { opacity: 0.7 },
  left: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DCE9FF', borderWidth: 2, borderColor: '#EFF4FF', alignItems: 'center', justifyContent: 'center' },
  avatarOverdue: { backgroundColor: '#FFDAD6' },
  avatarPaid: { backgroundColor: '#E8ECEC' },
  avatarText: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#00685F' },
  avatarTextOverdue: { color: '#93000A' },
  personBlock: { flex: 1, minWidth: 0 },
  personName: { fontSize: 18, lineHeight: 26, fontWeight: '700', color: '#0B1C30' },
  personNamePaid: { textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  meta: { fontSize: 13, lineHeight: 20, color: '#6D7A77' },
  metaOverdue: { color: '#BA1A1A', fontWeight: '600' },
  right: { alignItems: 'flex-end', marginLeft: 8 },
  amount: { fontSize: 17, lineHeight: 24, fontWeight: '800', color: '#006947' },
  amountPay: { color: '#B90538' },
  amountPaid: { color: '#6D7A77' },
  badge: { marginTop: 4, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeLent: { backgroundColor: 'rgba(0,105,71,0.10)' },
  badgePay: { backgroundColor: '#FFDAD6' },
  badgePaid: { backgroundColor: '#DCE9FF' },
  badgeText: { fontSize: 10, lineHeight: 16, fontWeight: '800', letterSpacing: 0.6 },
  badgeTextLent: { color: '#006947' },
  badgeTextPay: { color: '#93000A' },
  badgeTextPaid: { color: '#3D4947' },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 28, alignItems: 'center' },
  emptyTitle: { marginTop: 8, fontSize: 16, fontWeight: '800', color: '#0B1C30' },
  emptyText: { marginTop: 4, fontSize: 13, color: '#6D7A77', textAlign: 'center' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, backgroundColor: '#FFFFFF', borderTopLeftRadius: 12, borderTopRightRadius: 12, shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: -4 }, elevation: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { minWidth: 56, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 12, gap: 2 },
  navActive: { backgroundColor: '#008378', paddingHorizontal: 8 },
  navText: { fontSize: 9, color: '#3D4947' },
  navTextActive: { fontSize: 9, color: '#FFFFFF', fontWeight: '700' },
});
