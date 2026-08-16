import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = { mode: 'forgot' | 'reset'; email: string; newPassword: string; submitting: boolean; message: string | null; messageType: 'error' | 'success'; onEmailChange: (value: string) => void; onNewPasswordChange: (value: string) => void; onSubmit: () => void; onBack: () => void };

export function PasswordRecoveryScreen({ mode, email, newPassword, submitting, message, messageType, onEmailChange, onNewPasswordChange, onSubmit, onBack }: Props) {
  const isForgot = mode === 'forgot';
  return <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹  Back</Text></Pressable>
      <View style={styles.brand}><View style={styles.logo}><Text style={styles.mark}>O</Text></View><Text style={styles.brandName}>OweMate</Text></View>
      <Text style={styles.eyebrow}>{isForgot ? 'PASSWORD RESET' : 'NEW PASSWORD'}</Text>
      <Text style={styles.title}>{isForgot ? 'Forgot your password?' : 'Choose a new password.'}</Text>
      <Text style={styles.subtitle}>{isForgot ? 'Enter the email linked to your OweMate account and we’ll send you a secure reset link.' : 'Set a new password for your OweMate account.'}</Text>
      {message && <View style={[styles.message, messageType === 'error' ? styles.error : styles.success]}><Text style={styles.messageText}>{message}</Text></View>}
      <View style={styles.card}>
        {isForgot ? <><Text style={styles.label}>Email</Text><TextInput value={email} onChangeText={onEmailChange} placeholder="you@example.com" placeholderTextColor="#9AA7A5" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} /></> : <><Text style={styles.label}>New password</Text><TextInput value={newPassword} onChangeText={onNewPasswordChange} placeholder="At least 6 characters" placeholderTextColor="#9AA7A5" secureTextEntry style={styles.input} /></>}
        <Pressable style={[styles.button, submitting && styles.disabled]} onPress={onSubmit} disabled={submitting}>{submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{isForgot ? 'Send reset link' : 'Update password'}</Text>}</Pressable>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ keyboard:{flex:1}, container:{paddingHorizontal:20,paddingTop:10,paddingBottom:44}, back:{color:'#4F635F',fontSize:15,fontWeight:'700',marginBottom:30}, brand:{flexDirection:'row',alignItems:'center',marginBottom:28}, logo:{width:38,height:38,borderRadius:13,backgroundColor:'#0F766E',alignItems:'center',justifyContent:'center',marginRight:10},mark:{color:'#FFF',fontSize:20,fontWeight:'900'},brandName:{color:'#10201D',fontSize:19,fontWeight:'900'}, eyebrow:{color:'#0F766E',fontSize:11,fontWeight:'900',letterSpacing:1.2,marginBottom:7}, title:{fontSize:29,lineHeight:36,fontWeight:'800',color:'#10201D'}, subtitle:{fontSize:14,lineHeight:21,color:'#6B7D79',marginTop:10,marginBottom:20}, card:{backgroundColor:'#FFF',borderRadius:22,padding:18,borderWidth:1,borderColor:'#E2EAE8'},label:{fontSize:13,fontWeight:'800',color:'#30433F',marginBottom:8},input:{minHeight:52,borderWidth:1,borderColor:'#D6E1DE',borderRadius:14,paddingHorizontal:15,fontSize:16,color:'#10201D',backgroundColor:'#FBFCFC',marginBottom:12},button:{minHeight:54,borderRadius:15,backgroundColor:'#0F766E',alignItems:'center',justifyContent:'center',marginTop:4},disabled:{opacity:.6},buttonText:{color:'#FFF',fontSize:16,fontWeight:'800'},message:{padding:13,borderRadius:14,marginBottom:14},error:{backgroundColor:'#FFF1F2'},success:{backgroundColor:'#ECFDF5'},messageText:{color:'#334155',fontSize:13,lineHeight:19}}
