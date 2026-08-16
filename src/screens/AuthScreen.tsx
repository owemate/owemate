import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  mode: 'signin' | 'signup';
  email: string;
  password: string;
  submitting: boolean;
  configured: boolean;
  message: string | null;
  messageType: 'error' | 'success';
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function AuthScreen({ mode, email, password, submitting, configured, message, messageType, onEmailChange, onPasswordChange, onSubmit, onBack }: Props) {
  const isSignIn = mode === 'signin';

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack}><Text style={styles.back}>‹ Back</Text></Pressable>
        <Text style={styles.title}>{isSignIn ? 'Welcome back' : 'Create your account'}</Text>
        <Text style={styles.subtitle}>{isSignIn ? 'Sign in to continue to OweMate.' : 'Start keeping track of your money with OweMate.'}</Text>

        {message && <View style={[styles.message, messageType === 'error' ? styles.error : styles.success]}><Text style={styles.messageText}>{message}</Text></View>}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={onEmailChange} placeholder="you@example.com" placeholderTextColor="#94A3B8" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={onPasswordChange} placeholder="Enter your password" placeholderTextColor="#94A3B8" secureTextEntry style={styles.input} />
          <Pressable style={[styles.primaryButton, submitting && styles.disabled]} onPress={onSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>{isSignIn ? 'Sign in' : 'Create account'}</Text>}
          </Pressable>
          {!configured && <Text style={styles.hint}>Supabase is not configured in this local environment yet.</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  container: { padding: 24, paddingBottom: 40 },
  back: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 36 },
  title: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#64748B', marginBottom: 28 },
  form: { gap: 10 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 8 },
  input: { height: 52, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#0F172A', backgroundColor: '#FFFFFF', marginBottom: 6 },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  disabled: { opacity: 0.6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  hint: { color: '#94A3B8', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8 },
  message: { padding: 12, borderRadius: 12, marginBottom: 16 },
  error: { backgroundColor: '#FEE2E2' },
  success: { backgroundColor: '#DCFCE7' },
  messageText: { color: '#334155', fontSize: 13, lineHeight: 19 },
});
