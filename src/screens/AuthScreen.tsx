import { useState } from 'react';
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
  onForgotPassword: () => void;
  onBack: () => void;
};

export function AuthScreen({ mode, email, password, submitting, configured, message, messageType, onEmailChange, onPasswordChange, onSubmit, onForgotPassword, onBack }: Props) {
  const isSignIn = mode === 'signin';
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = () => {
    setLocalError(null);
    if (!isSignIn) {
      if (!name.trim()) { setLocalError('Please enter your name.'); return; }
      if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
    }
    onSubmit();
  };

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>O</Text></View>
          <Text style={styles.title}>{isSignIn ? 'Welcome Back!' : 'Create your account'}</Text>
          <Text style={styles.subtitle}>Track. Remind. Settle.</Text>

          {(localError || message) && <View style={[styles.message, localError || messageType === 'error' ? styles.error : styles.success]}><Text style={styles.messageText}>{localError ?? message}</Text></View>}

          <View style={styles.form}>
            {!isSignIn && <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#9AA7A5" autoCapitalize="words" style={styles.input} />}
            <TextInput value={email} onChangeText={onEmailChange} placeholder="Email" placeholderTextColor="#9AA7A5" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />
            <TextInput value={password} onChangeText={onPasswordChange} placeholder="Password" placeholderTextColor="#9AA7A5" secureTextEntry style={styles.input} />
            {!isSignIn && <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" placeholderTextColor="#9AA7A5" secureTextEntry style={styles.input} onSubmitEditing={submit} />}
            {isSignIn && <Pressable onPress={onForgotPassword} style={styles.forgot}><Text style={styles.forgotText}>Forgot Password?</Text></Pressable>}
            <Pressable style={[styles.primaryButton, submitting && styles.disabled]} onPress={submit} disabled={submitting}>{submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{isSignIn ? 'Sign In' : 'Sign Up'}</Text>}</Pressable>
          </View>

          {!configured && <Text style={styles.hint}>Supabase is not configured in this local environment yet.</Text>}
          <View style={styles.footer}><Text style={styles.footerText}>{isSignIn ? "Don't have an account?" : 'Already have an account?'}</Text><Pressable onPress={onBack}><Text style={styles.link}>{isSignIn ? ' Sign Up' : ' Sign In'}</Text></Pressable></View>
          <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}><Text style={styles.backText}>‹ Back</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 }, scroll: { flex: 1, backgroundColor: '#F4F7F6' }, container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  card: { width: '100%', maxWidth: 350, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E0E9E6', shadowColor: '#10201D', shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  brandMark: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#0F766E', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }, brandMarkText: { color: '#FFFFFF', fontSize: 31, fontWeight: '900' },
  title: { color: '#10201D', fontSize: 28, lineHeight: 34, fontWeight: '900', textAlign: 'center' }, subtitle: { color: '#70807C', fontSize: 13, textAlign: 'center', marginTop: 7, marginBottom: 24 },
  form: { gap: 16 }, input: { height: 56, borderWidth: 1, borderColor: '#D6E1DE', borderRadius: 14, backgroundColor: '#FFFFFF', paddingHorizontal: 16, fontSize: 15, color: '#12221F' },
  forgot: { alignSelf: 'flex-end', marginTop: -5 }, forgotText: { color: '#0F766E', fontSize: 12, fontWeight: '800' },
  primaryButton: { height: 56, borderRadius: 16, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center', marginTop: 2 }, disabled: { opacity: 0.55 }, primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 }, footerText: { fontSize: 12, color: '#6B7D79' }, link: { fontSize: 12, color: '#0F766E', fontWeight: '900' }, hint: { fontSize: 10, color: '#8A9A96', textAlign: 'center', marginTop: 12 },
  message: { padding: 12, borderRadius: 13, marginBottom: 16 }, error: { backgroundColor: '#FFF1F2' }, success: { backgroundColor: '#ECFDF5' }, messageText: { fontSize: 12, lineHeight: 18, color: '#334155' }, backButton: { alignSelf: 'center', marginTop: 18 }, backText: { fontSize: 12, fontWeight: '800', color: '#52635F' },
});
