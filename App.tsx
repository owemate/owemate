import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'signin' | 'signup'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <View style={styles.brandBlock}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoMark}>O</Text>
            </View>
            <Text style={styles.logo}>OweMate</Text>
            <Text style={styles.title}>Know who owes whom.</Text>
            <Text style={styles.subtitle}>
              Keep track of money you lend or owe to people you know — simply and privately.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => setScreen('signin')}>
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => setScreen('signup')}>
              <Text style={styles.secondaryButtonText}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isSignIn = screen === 'signin';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.formContainer}>
          <Pressable onPress={() => setScreen('welcome')}>
            <Text style={styles.backButton}>‹ Back</Text>
          </Pressable>

          <Text style={styles.formTitle}>{isSignIn ? 'Welcome back' : 'Create your account'}</Text>
          <Text style={styles.formSubtitle}>
            {isSignIn ? 'Sign in to continue to OweMate.' : 'Start keeping track of your money with OweMate.'}
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
            />

            <Pressable style={styles.primaryButton} onPress={() => {}}>
              <Text style={styles.primaryButtonText}>{isSignIn ? 'Sign in' : 'Create account'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardContainer: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between', padding: 24, paddingBottom: 32 },
  brandBlock: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoMark: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  logo: { fontSize: 34, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 25, color: '#64748B', textAlign: 'center', maxWidth: 350 },
  actions: { gap: 12 },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  formContainer: { flex: 1, padding: 24 },
  backButton: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 36 },
  formTitle: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  formSubtitle: { fontSize: 16, lineHeight: 24, color: '#64748B', marginBottom: 32 },
  form: { gap: 10 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 8 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
  },
});
