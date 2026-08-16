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
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹  Back</Text></Pressable>
        <View style={styles.brand}><View style={styles.logoCircle}><Text style={styles.logoMark}>O</Text></View><Text style={styles.brandName}>OweMate</Text></View>
        <Text style={styles.eyebrow}>{isSignIn ? 'WELCOME BACK' : 'GET STARTED'}</Text>
        <Text style={styles.title}>{isSignIn ? 'Your money, in one clear view.' : 'Start tracking money simply.'}</Text>
        <Text style={styles.subtitle}>{isSignIn ? 'Sign in to continue to your personal money overview.' : 'Create an account to keep your peer-to-peer records safe and organized.'}</Text>

        {message && <View style={[styles.message, messageType === 'error' ? styles.error : styles.success]}><Text style={styles.messageText}>{message}</Text></View>}

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={onEmailChange} placeholder="you@example.com" placeholderTextColor="#9AA7A5" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} returnKeyType="next" />
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={onPasswordChange} placeholder="Enter your password" placeholderTextColor="#9AA7A5" secureTextEntry style={styles.input} returnKeyType="done" onSubmitEditing={onSubmit} />
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
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 44 },
  back: { color: '#4F635F', fontSize: 15, fontWeight: '700', marginBottom: 30 },
  brand: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  logoCircle: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoMark: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  brandName: { color: '#10201D', fontSize: 19, fontWeight: '900' },
  eyebrow: { color: '#0F766E', fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginBottom: 7 },
  title: { fontSize: 29, lineHeight: 36, fontWeight: '850', color: '#10201D' },
  subtitle: { fontSize: 14, lineHeight: 21, color: '#6B7D79', marginTop: 10, marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#E2EAE8' },
  label: { fontSize: 13, fontWeight: '800', color: '#30433F', marginBottom: 8, marginTop: 4 },
  input: { minHeight: 52, borderWidth: 1, borderColor: '#D6E1DE', borderRadius: 14, paddingHorizontal: 15, fontSize: 16, color: '#10201D', backgroundColor: '#FBFCFC', marginBottom: 12 },
  primaryButton: { minHeight: 54, borderRadius: 15, backgroundColor: '#0F766E', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  disabled: { opacity: 0.6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  hint: { color: '#8A9A96', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10 },
  message: { padding: 13, borderRadius: 14, marginBottom: 14 },
  error: { backgroundColor: '#FFF1F2' },
  success: { backgroundColor: '#ECFDF5' },
  messageText: { color: '#334155', fontSize: 13, lineHeight: 19 },
});
