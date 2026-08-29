import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { onSignIn: () => void; onSignUp: () => void };

export function WelcomeScreen({ onSignIn, onSignUp }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="account-balance-wallet" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.brand}>OweMate</Text>
        </View>

        <Text style={styles.tagline}>Track. Remind. Settle.</Text>

        <View style={styles.spacer} />

        <View style={styles.messageBlock}>
          <Text style={styles.title}>Stay on top of every shared expense.</Text>
          <Text style={styles.subtitle}>
            Keep track of money you lend or owe, set reminders, and settle up with ease.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={onSignUp}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          onPress={onSignIn}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brand: {
    color: '#10201D',
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
  },
  tagline: {
    color: '#5E716D',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
  },
  spacer: {
    flex: 1,
  },
  messageBlock: {
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 44,
  },
  title: {
    color: '#10201D',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7D79',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 12,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F2F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#10201D',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
});
