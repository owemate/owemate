import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { formatCurrency } from '../utils/currency';
import { parseUserDate } from '../utils/date';
import type { Transaction } from '../types/transaction';

type Props = {
  transactions: Transaction[];
  onAdd: () => void;
  onPeople: () => void;
  onReminders: () => void;
  onSignOut: () => void;
  onToggleSettled: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

function isOverdue(item: Transaction) {
  if (item.status === 'settled' || item.dueDate === 'No date set') return false;
  const date = parseUserDate(item.dueDate);
  if (!date) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() < today.getTime();
}

function relativeDueLabel(value: string) {
  const date = parseUserDate(value);
  if (!date) return value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1 && days < 8) return `in ${days} Days`;
  if (days < 0) return 'Overdue';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || '?';
}

export function DashboardScreen({ transactions, onAdd, onPeople, onReminders, onSignOut }: Props) {
  const pending = transactions.filter((item) => item.status !== 'settled');
  const youLent = pending.filter((item) => item.type === 'lent').reduce((sum, item) => sum + item.amount, 0);
  const youBorrowed = pending.filter((item) => item.type === 'owed').reduce((sum, item) => sum + item.amount, 0);
  const outstanding = youLent - youBorrowed;
  const overdue = pending.filter(isOverdue).length;

  const upcoming = useMemo(() => {
    return [...pending]
      .sort((a, b) => {
        const aDate = parseUserDate(a.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const bDate = parseUserDate(b.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return aDate - bDate;
      })
      .slice(0, 3);
  }, [transactions]);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.name}>Alex</Text>
            </View>
          </View>
          <Pressable onPress={onReminders} style={styles.notificationButton} hitSlop={10}>
            <Ionicons name="notifications-outline" size={22} color="#263532" />
            {overdue > 0 && <View style={styles.notificationDot} />}
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryGlow} />
          <Text style={styles.summaryLabel}>Outstanding Balance</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(outstanding)}</Text>
        </View>

        <View style={styles.balanceRow}>
          <View style={[styles.smallBalance, styles.lentCard]}>
            <View style={styles.smallLabelRow}>
              <Text style={styles.lentArrow}>↑</Text>
              <Text style={styles.smallLabel}>YOU LENT</Text>
            </View>
            <Text style={[styles.smallAmount, styles.lentText]}>{formatCurrency(youLent)}</Text>
          </View>
          <View style={[styles.smallBalance, styles.borrowedCard]}>
            <View style={styles.smallLabelRow}>
              <Text style={styles.borrowedArrow}>↓</Text>
              <Text style={styles.smallLabel}>YOU BORROWED</Text>
            </View>
            <Text style={[styles.smallAmount, styles.borrowedText]}>{formatCurrency(youBorrowed)}</Text>
          </View>
        </View>

        <Pressable style={styles.addButton} onPress={onAdd}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Dues</Text>
          <Pressable onPress={onPeople} hitSlop={8}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.duesCard}>
          {upcoming.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No upcoming dues</Text>
              <Text style={styles.emptyText}>Add a transaction to start tracking repayments.</Text>
            </View>
          ) : (
            upcoming.map((item, index) => {
              const overdueItem = isOverdue(item);
              return (
                <Pressable
                  key={item.id}
                  onPress={onPeople}
                  style={[styles.dueItem, index > 0 && styles.dueItemBorder]}
                >
                  <View style={styles.duePerson}>
                    <View style={[styles.personAvatar, overdueItem && styles.overdueAvatar]}>
                      <Text style={[styles.personInitial, overdueItem && styles.overdueInitial]}>{initials(item.person)}</Text>
                    </View>
                    <View style={styles.personInfo}>
                      <Text style={styles.personName} numberOfLines={1}>{item.person}</Text>
                      <View style={styles.dateRow}>
                        <Ionicons name={overdueItem ? 'warning-outline' : 'calendar-outline'} size={13} color={overdueItem ? '#BA1A1A' : '#53635F'} />
                        <Text style={[styles.dueDate, overdueItem && styles.overdueDate]}>{relativeDueLabel(item.dueDate)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.dueAmountWrap}>
                    <Text style={[styles.dueAmount, item.type === 'owed' && styles.payAmount]}>{formatCurrency(item.amount)}</Text>
                    <View style={[styles.badge, item.type === 'owed' || overdueItem ? styles.payBadge : styles.receiveBadge]}>
                      <Text style={[styles.badgeText, item.type === 'owed' || overdueItem ? styles.payBadgeText : styles.receiveBadgeText]}>
                        {item.type === 'owed' ? 'TO PAY' : 'TO RECEIVE'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="home" size={21} color="#FFFFFF" />
          <Text style={styles.activeNavText}>Home</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={onPeople}>
          <Ionicons name="list-outline" size={21} color="#3D4947" />
          <Text style={styles.navText}>Transactions</Text>
        </Pressable>
        <View style={styles.fabSlot}>
          <Pressable style={styles.fab} onPress={onAdd}>
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.navText}>Add</Text>
        </View>
        <Pressable style={styles.navItem} onPress={onReminders}>
          <Ionicons name="calendar-outline" size={21} color="#3D4947" />
          <Text style={styles.navText}>Calendar</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={onSignOut}>
          <Ionicons name="person-outline" size={21} color="#3D4947" />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FF' },
  scroll: { flex: 1 },
  content: { paddingBottom: 108 },
  header: { height: 66, paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8F9FF', borderBottomWidth: 1, borderBottomColor: '#EEF1F7' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DCE9FF', borderWidth: 1, borderColor: '#BCC9C6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#00685F' },
  greeting: { fontSize: 14, lineHeight: 20, color: '#3D4947' },
  name: { fontSize: 20, lineHeight: 28, fontWeight: '800', color: '#00685F' },
  notificationButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#BA1A1A', borderWidth: 1, borderColor: '#F8F9FF' },
  summaryCard: { height: 104, marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: 12, backgroundColor: '#FFFFFF', overflow: 'hidden', shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  summaryGlow: { position: 'absolute', right: -40, top: -40, width: 128, height: 128, borderRadius: 64, backgroundColor: '#008378', opacity: 0.2 },
  summaryLabel: { fontSize: 14, lineHeight: 20, color: '#3D4947' },
  summaryAmount: { marginTop: 4, fontSize: 40, lineHeight: 48, fontWeight: '900', letterSpacing: -0.8, color: '#0B1C30' },
  balanceRow: { flexDirection: 'row', gap: 16, marginHorizontal: 20, marginTop: 16 },
  smallBalance: { flex: 1, height: 84, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  lentCard: { borderLeftWidth: 4, borderLeftColor: '#006947' },
  borrowedCard: { borderLeftWidth: 4, borderLeftColor: '#B90538' },
  smallLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  smallLabel: { fontSize: 12, lineHeight: 16, fontWeight: '800', letterSpacing: 0.6, color: '#3D4947' },
  lentArrow: { color: '#006947', fontSize: 17, fontWeight: '900' },
  borrowedArrow: { color: '#B90538', fontSize: 17, fontWeight: '900' },
  smallAmount: { marginTop: 8, fontSize: 20, lineHeight: 28, fontWeight: '700' },
  lentText: { color: '#006947' },
  borrowedText: { color: '#B90538' },
  addButton: { height: 60, marginHorizontal: 20, marginTop: 24, borderRadius: 30, backgroundColor: '#00685F', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#64748B', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  addButtonText: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: '#FFFFFF' },
  sectionHeader: { marginHorizontal: 20, marginTop: 24, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: '#0B1C30' },
  viewAll: { fontSize: 14, lineHeight: 20, fontWeight: '800', color: '#00685F' },
  duesCard: { marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  dueItem: { minHeight: 79, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dueItemBorder: { borderTopWidth: 1, borderTopColor: 'rgba(188,201,198,0.3)' },
  duePerson: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 },
  personAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DCE9FF', alignItems: 'center', justifyContent: 'center' },
  overdueAvatar: { backgroundColor: '#FFDAD6' },
  personInitial: { fontSize: 16, lineHeight: 24, fontWeight: '800', color: '#00685F' },
  overdueInitial: { color: '#93000A' },
  personInfo: { flex: 1, minWidth: 0 },
  personName: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#0B1C30' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  dueDate: { fontSize: 14, lineHeight: 20, color: '#3D4947' },
  overdueDate: { color: '#BA1A1A', fontWeight: '600' },
  dueAmountWrap: { alignItems: 'flex-end', marginLeft: 8 },
  dueAmount: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#006947' },
  payAmount: { color: '#B90538' },
  badge: { marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  receiveBadge: { backgroundColor: 'rgba(78,222,163,0.2)' },
  payBadge: { backgroundColor: 'rgba(255,178,183,0.3)' },
  badgeText: { fontSize: 10, lineHeight: 15, fontWeight: '800', letterSpacing: 0.5 },
  receiveBadgeText: { color: '#006947' },
  payBadgeText: { color: '#B90538' },
  empty: { padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#0B1C30' },
  emptyText: { marginTop: 4, fontSize: 12, color: '#6B7D79', textAlign: 'center' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 66, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4, backgroundColor: '#FFFFFF', borderTopLeftRadius: 12, borderTopRightRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#64748B', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: -4 }, elevation: 8 },
  navItem: { width: 64, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 2 },
  activeNavItem: { backgroundColor: '#008378' },
  navText: { fontSize: 10, lineHeight: 10, color: '#3D4947' },
  activeNavText: { fontSize: 10, lineHeight: 10, color: '#F4FFFC' },
  fabSlot: { width: 56, height: 38, alignItems: 'center', position: 'relative' },
  fab: { position: 'absolute', top: -32, width: 56, height: 56, borderRadius: 28, backgroundColor: '#00685F', borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
});
