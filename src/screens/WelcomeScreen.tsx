import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  onSignIn: () => void;
  onSignUp: () => void;
};

export function WelcomeScreen({ onSignIn, onSignUp }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.brandBlock}>
        <View style={styles.logoCircle}><Text style={styles.logoMark}>O</Text></View>
        <Text style={styles.logo}>OweMate</Text>
        <Text style={styles.title}>Know who owes whom.</Text>
        <Text style={styles.subtitle}>
          Keep track of money you lend or owe to people you know — simply and privately.
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={onSignIn}>
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onSignUp}>
          <Text style={styles.secondaryButtonText}>Create account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 24, paddingBottom: 32 },
  brandBlock: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoMark: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  logo: { fontSize: 34, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 25, color: '#64748B', textAlign: 'center', maxWidth: 350 },
  actions: { gap: 12 },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: { height: 54, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  secondaryButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
});
