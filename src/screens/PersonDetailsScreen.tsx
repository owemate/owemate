import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/currency';
import { formatDatabaseDate } from '../utils/date';

type Props = { person: string; transactions: Transaction[]; onBack: () => void; onAdd: () => void; onToggleSettled: (transaction: Transaction) => void; };

export function PersonDetailsScreen({ person, transactions, onBack, onAdd, onToggleSettled }: Props) {
  const records = transactions.filter((item) => item.person.trim().toLowerCase() === person.trim().toLowerCase());
  const lent = records.filter((item) => item.type === 'lent').reduce((sum, item) => sum + item.amount, 0);
  const owed = records.filter((item) => item.type === 'owed').reduce((sum, item) => sum + item.amount, 0);
  const pending = records.filter((item) => item.status !== 'settled');
  const balance = lent - owed;

  return <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹  People</Text></Pressable>
    <View style={styles.hero}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{person.charAt(0).toUpperCase()}</Text></View>
      <Text style={styles.eyebrow}>PERSON</Text>
      <Text style={styles.title}>{person}</Text>
      <Text style={[styles.balance, balance < 0 && styles.negative]}>{balance >= 0 ? '+' : '-'}{formatCurrency(balance)}</Text>
      <Text style={styles.balanceLabel}>{balance > 0 ? 'They owe you' : balance < 0 ? 'You owe' : 'Settled'}</Text>
    </View>
    <View style={styles.statsRow}>
      <Stat label="Lent" value={formatCurrency(lent)} />
      <Stat label="Owed" value={formatCurrency(owed)} />
      <Stat label="Pending" value={String(pending.length)} />
    </View>
    <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Transactions</Text><Text style={styles.sectionSubtitle}>{records.length} record{records.length === 1 ? '' : 's'}</Text></View><Pressable style={styles.addButton} onPress={onAdd}><Text style={styles.addButtonText}>+ Add</Text></Pressable></View>
    {records.map((item) => <View style={styles.card} key={item.id}>
      <View style={styles.cardTop}><View style={[styles.typeDot, item.type === 'owed' && styles.typeDotOwed]}><Text style={styles.typeText}>{item.type === 'lent' ? 'L' : 'O'}</Text></View><View style={styles.details}><Text style={styles.amount}>{formatCurrency(item.amount)}</Text><Text style={styles.meta}>{item.type === 'lent' ? 'You lent' : 'You owe'} · {formatDatabaseDate(item.dueDate)}</Text>{item.note && item.note !== 'No note' && <Text style={styles.note} numberOfLines={1}>{item.note}</Text>}</View><View style={styles.right}><View style={[styles.status, item.status === 'settled' && styles.statusSettled]}><Text style={[styles.statusText, item.status === 'settled' && styles.statusTextSettled]}>{item.status === 'settled' ? 'Settled' : 'Pending'}</Text></View></View></View>
      {item.status !== 'settled' && <Pressable style={styles.settleButton} onPress={() => onToggleSettled(item)}><Text style={styles.settleText}>Mark as repaid</Text></Pressable>}
    </View>)}
    {records.length === 0 && <View style={styles.empty}><Text style={styles.emptyTitle}>No transactions</Text><Text style={styles.emptyText}>Add a record for {person} to start tracking the balance.</Text></View>}
  </ScrollView>;
}

function Stat({ label, value }: { label: string; value: string }) { return <View style={styles.stat}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>; }

const styles = StyleSheet.create({ scroll:{flex:1},container:{paddingHorizontal:20,paddingTop:12,paddingBottom:34},back:{color:'#4F635F',fontSize:15,fontWeight:'700',marginBottom:20},hero:{backgroundColor:'#10201D',borderRadius:24,padding:22,alignItems:'center'},avatar:{width:58,height:58,borderRadius:20,backgroundColor:'#D9F2ED',alignItems:'center',justifyContent:'center',marginBottom:12},avatarText:{fontSize:22,fontWeight:'900',color:'#0F766E'},eyebrow:{color:'#8DD9CA',fontSize:10,fontWeight:'900',letterSpacing:1.4},title:{color:'#FFFFFF',fontSize:27,fontWeight:'900',marginTop:4},balance:{color:'#8FE0CF',fontSize:24,fontWeight:'900',marginTop:12},negative:{color:'#FFB0B0'},balanceLabel:{color:'#B9C8C4',fontSize:11,marginTop:2},statsRow:{flexDirection:'row',backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1EAE7',borderRadius:18,marginTop:12,paddingVertical:16},stat:{flex:1,alignItems:'center',borderRightWidth:1,borderRightColor:'#E7EEEC'},statLabel:{fontSize:10,color:'#8A9A96',fontWeight:'700'},statValue:{fontSize:13,color:'#10201D',fontWeight:'900',marginTop:4},sectionHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:24,marginBottom:10},sectionTitle:{fontSize:18,fontWeight:'900',color:'#10201D'},sectionSubtitle:{fontSize:11,color:'#8A9A96',marginTop:2},addButton:{backgroundColor:'#0F766E',paddingHorizontal:14,paddingVertical:9,borderRadius:12},addButtonText:{color:'#FFFFFF',fontSize:12,fontWeight:'900'},card:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1EAE7',borderRadius:18,padding:14,marginBottom:9},cardTop:{flexDirection:'row',alignItems:'center'},typeDot:{width:38,height:38,borderRadius:13,backgroundColor:'#D9F2ED',alignItems:'center',justifyContent:'center',marginRight:11},typeDotOwed:{backgroundColor:'#FCE7E7'},typeText:{fontSize:13,fontWeight:'900',color:'#0F766E'},details:{flex:1,minWidth:0},amount:{fontSize:15,fontWeight:'900',color:'#10201D'},meta:{fontSize:10,color:'#8A9A96',marginTop:3},note:{fontSize:10,color:'#7A8A87',marginTop:4},right:{marginLeft:8},status:{backgroundColor:'#FFF4D6',paddingHorizontal:8,paddingVertical:5,borderRadius:9},statusSettled:{backgroundColor:'#E5F5EF'},statusText:{fontSize:9,fontWeight:'900',color:'#9A6A00'},statusTextSettled:{color:'#16735F'},settleButton:{borderTopWidth:1,borderTopColor:'#EDF2F0',marginTop:12,paddingTop:10},settleText:{color:'#0F766E',fontSize:11,fontWeight:'900',textAlign:'center'},empty:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1EAE7',borderRadius:18,padding:24,alignItems:'center'},emptyTitle:{fontSize:16,fontWeight:'900',color:'#10201D'},emptyText:{fontSize:12,lineHeight:18,color:'#7A8A87',textAlign:'center',marginTop:5}
});
