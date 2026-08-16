import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

type Props = { enabled: boolean; onEnabledChange: (value: boolean) => void; onBack: () => void; };

export function ReminderSettingsScreen({ enabled, onEnabledChange, onBack }: Props) {
  return <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
    <Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹  Settings</Text></Pressable>
    <Text style={styles.eyebrow}>NOTIFICATIONS</Text>
    <Text style={styles.title}>Repayment reminders</Text>
    <Text style={styles.subtitle}>Never lose track of a commitment date. OweMate can remind you before and after a repayment is due.</Text>
    <View style={styles.card}>
      <View style={styles.icon}><Text style={styles.iconText}>🔔</Text></View>
      <View style={styles.copy}><Text style={styles.cardTitle}>Reminders</Text><Text style={styles.cardText}>{enabled ? 'Active for your pending records.' : 'Reminders are currently turned off.'}</Text></View>
      <Switch value={enabled} onValueChange={onEnabledChange} trackColor={{ false: '#D9E2E0', true: '#86CFC1' }} thumbColor={enabled ? '#0F766E' : '#FFFFFF'} />
    </View>
    <Text style={styles.section}>WHEN OWE MATE REMINDS YOU</Text>
    <View style={styles.infoCard}><Row label="Before due date" value="1 day before" /><Row label="Due date" value="9:00 AM" /><Row label="Overdue" value="9:00 AM next day" /></View>
    <Text style={styles.footnote}>Settled records are automatically excluded from reminders. Changing a commitment date reschedules its reminders.</Text>
  </ScrollView>;
}
function Row({ label, value }: { label: string; value: string }) { return <View style={styles.row}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View>; }
const styles = StyleSheet.create({scroll:{flex:1},container:{padding:20,paddingBottom:40},back:{fontSize:15,fontWeight:'700',color:'#4F635F',marginBottom:28},eyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1.4,color:'#0F766E'},title:{fontSize:29,fontWeight:'900',color:'#10201D',marginTop:5},subtitle:{fontSize:13,lineHeight:20,color:'#71827E',marginTop:8,marginBottom:20},card:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1EAE7',borderRadius:20,padding:16,flexDirection:'row',alignItems:'center'},icon:{width:44,height:44,borderRadius:14,backgroundColor:'#EAF5F2',alignItems:'center',justifyContent:'center',marginRight:12},iconText:{fontSize:20},copy:{flex:1},cardTitle:{fontSize:15,fontWeight:'900',color:'#10201D'},cardText:{fontSize:11,color:'#7A8A87',marginTop:3},section:{fontSize:10,fontWeight:'900',letterSpacing:1.2,color:'#8A9A96',marginTop:24,marginBottom:8},infoCard:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1EAE7',borderRadius:18,paddingHorizontal:16},row:{minHeight:50,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#EDF2F0'},rowLabel:{fontSize:12,color:'#667773'},rowValue:{fontSize:12,fontWeight:'900',color:'#10201D'},footnote:{fontSize:10,lineHeight:16,color:'#8A9A96',textAlign:'center',marginTop:18}
});
