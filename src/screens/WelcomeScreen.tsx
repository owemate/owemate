import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { onSignIn: () => void; onSignUp: () => void };

export function WelcomeScreen({ onSignIn, onSignUp }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}><Text style={styles.logoMark}>O</Text></View>
        <Text style={styles.brand}>OweMate</Text>
        <View style={styles.pill}><Text style={styles.pillText}>PERSONAL MONEY TRACKER</Text></View>
        <Text style={styles.title}>Know who owes whom.</Text>
        <Text style={styles.subtitle}>Keep track of money you lend or owe to people you know — clearly, privately, and without the clutter.</Text>
        <View style={styles.previewCard}>
          <View><Text style={styles.previewLabel}>NET BALANCE</Text><Text style={styles.previewAmount}>₹ 12,450</Text></View>
          <View style={styles.previewIcon}><Text style={styles.previewIconText}>↗</Text></View>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={onSignIn}><Text style={styles.primaryButtonText}>Sign in</Text><Text style={styles.arrow}>→</Text></Pressable>
        <Pressable style={styles.secondaryButton} onPress={onSignUp}><Text style={styles.secondaryButtonText}>Create account</Text></Pressable>
        <Text style={styles.footnote}>Simple P2P tracking. No lending or credit services.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 18 },
  hero: { alignItems: 'center', paddingTop: 10 },
  logoCircle: { width: 66, height: 66, borderRadius: 22, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#0F766E', shadowOpacity: 0.22, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  logoMark: { color: '#FFFFFF', fontSize: 34, fontWeight: '900' },
  brand: { color: '#10201D', fontSize: 30, fontWeight: '900' },
  pill: { backgroundColor: '#D9F2ED', paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, marginTop: 14 },
  pillText: { color: '#0F766E', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: '#10201D', fontSize: 31, lineHeight: 38, fontWeight: '900', textAlign: 'center', marginTop: 22 },
  subtitle: { color: '#6B7D79', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10, maxWidth: 350 },
  previewCard: { width: '100%', marginTop: 24, backgroundColor: '#10201D', borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  previewLabel: { color: '#AFC4BF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  previewAmount: { color: '#FFFFFF', fontSize: 27, fontWeight: '900', marginTop: 5 },
  previewIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#1D4942', alignItems: 'center', justifyContent: 'center' },
  previewIconText: { color: '#8EE0D1', fontSize: 22, fontWeight: '800' },
  actions: { gap: 11 },
  primaryButton: { minHeight: 56, borderRadius: 16, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFFFFF', fontSize: 20, marginLeft: 10 },
  secondaryButton: { minHeight: 52, borderRadius: 16, borderWidth: 1, borderColor: '#CBD9D5', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  secondaryButtonText: { color: '#1E332F', fontSize: 15, fontWeight: '800' },
  footnote: { color: '#91A09D', fontSize: 11, textAlign: 'center', marginTop: 2 },
});
