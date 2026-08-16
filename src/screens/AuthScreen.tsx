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
        <View style={styles.topBar}>
          <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}><Text style={styles.backIcon}>‹</Text><Text style={styles.backText}>{isSignIn ? 'Welcome' : 'Sign In'}</Text></Pressable>
          <Text style={styles.topBrand}>OweMate</Text>
        </View>

        <View style={styles.authCard}>
          <View style={styles.welcomeIcon}><Text style={styles.welcomeIconText}>♙</Text></View>
          <Text style={styles.title}>{isSignIn ? 'Welcome Back!' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>{isSignIn ? 'Track. Remind. Settle.' : 'Track. Remind. Settle.'}</Text>

          {message && <View style={[styles.message, messageType === 'error' ? styles.error : styles.success]}><Text style={styles.messageText}>{message}</Text></View>}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}><Text style={styles.inputIcon}>✉</Text><TextInput value={email} onChangeText={onEmailChange} placeholder="Email" placeholderTextColor="#98A4A2" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} returnKeyType="next" /></View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}><Text style={styles.inputIcon}>♙</Text><TextInput value={password} onChangeText={onPasswordChange} placeholder="Password" placeholderTextColor="#98A4A2" secureTextEntry style={styles.input} returnKeyType="done" onSubmitEditing={onSubmit} /><Text style={styles.eye}>◉</Text></View>
          </View>

          {isSignIn && <Pressable hitSlop={8} style={styles.forgot}><Text style={styles.forgotText}>Forgot Password?</Text></Pressable>}

          <Pressable style={[styles.primaryButton, submitting && styles.disabled]} onPress={onSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>{isSignIn ? 'Sign In' : 'Create Account'}</Text>}
          </Pressable>

          {!configured && <Text style={styles.hint}>Supabase is not configured in this local environment yet.</Text>}

          <View style={styles.dividerRow}><View style={styles.line} /><Text style={styles.or}>or</Text><View style={styles.line} /></View>
          <View style={styles.socialButton}><Text style={styles.socialIcon}>G</Text><Text style={styles.socialText}>Continue with Google</Text></View>
          <View style={styles.socialButton}><Text style={styles.socialIconApple}>●</Text><Text style={styles.socialText}>Continue with Apple</Text></View>

          <Text style={styles.footerText}>{isSignIn ? "Don't have an account? " : 'Already have an account? '}<Pressable onPress={onBack}><Text style={styles.footerLink}>{isSignIn ? 'Sign Up' : 'Sign In'}</Text></Pressable></Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard:{flex:1},scroll:{flex:1,backgroundColor:'#F5F7FF'},container:{paddingHorizontal:18,paddingTop:8,paddingBottom:34,minHeight:'100%'},
  topBar:{height:42,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8},backButton:{flexDirection:'row',alignItems:'center',paddingVertical:7},backIcon:{fontSize:25,lineHeight:25,color:'#51605E',marginRight:5},backText:{fontSize:12,fontWeight:'700',color:'#66736F'},topBrand:{fontSize:12,fontWeight:'900',color:'#68746F',letterSpacing:.2},
  authCard:{backgroundColor:'#FFFFFF',borderRadius:17,borderWidth:1,borderColor:'#DCE1FF',paddingHorizontal:16,paddingTop:20,paddingBottom:18,shadowColor:'#4F46E5',shadowOpacity:.08,shadowRadius:14,shadowOffset:{width:0,height:5},elevation:3},
  welcomeIcon:{width:34,height:34,borderRadius:17,backgroundColor:'#E1ECFF',alignSelf:'center',alignItems:'center',justifyContent:'center',marginBottom:8},welcomeIconText:{fontSize:18,color:'#007D73',fontWeight:'900'},title:{fontSize:18,fontWeight:'900',color:'#071A24',textAlign:'center'},subtitle:{fontSize:9,color:'#788482',textAlign:'center',marginTop:3,marginBottom:16},
  message:{padding:10,borderRadius:9,marginBottom:10},error:{backgroundColor:'#FFF1F2'},success:{backgroundColor:'#ECFDF5'},messageText:{fontSize:10,lineHeight:14,color:'#334155'},fieldGroup:{marginBottom:10},label:{fontSize:9,fontWeight:'700',color:'#65736F',marginBottom:4},inputWrap:{height:35,borderWidth:1,borderColor:'#D7DEDC',borderRadius:5,backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',paddingHorizontal:8},inputIcon:{fontSize:11,color:'#87938F',width:16},input:{flex:1,height:35,fontSize:10,color:'#12221F',paddingVertical:0},eye:{fontSize:10,color:'#9BA6A3'},forgot:{alignSelf:'flex-end',marginTop:-3,marginBottom:11},forgotText:{fontSize:8,color:'#0F766E',fontWeight:'600'},
  primaryButton:{height:37,borderRadius:19,backgroundColor:'#007A70',alignItems:'center',justifyContent:'center',marginBottom:4},disabled:{opacity:.6},primaryButtonText:{color:'#FFFFFF',fontSize:10,fontWeight:'900'},hint:{fontSize:9,lineHeight:13,color:'#8A9A96',textAlign:'center',marginTop:5},
  dividerRow:{flexDirection:'row',alignItems:'center',marginVertical:11},line:{height:1,flex:1,backgroundColor:'#E8ECEB'},or:{fontSize:8,color:'#9BA5A2',marginHorizontal:9},socialButton:{height:34,borderWidth:1,borderColor:'#D7DEDC',borderRadius:18,flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:7,backgroundColor:'#FFFFFF'},socialIcon:{fontSize:11,fontWeight:'900',color:'#4285F4',marginRight:7},socialIconApple:{fontSize:10,color:'#111827',marginRight:7},socialText:{fontSize:8,color:'#42504D',fontWeight:'700'},footerText:{fontSize:8,color:'#8A9693',textAlign:'center',marginTop:9},footerLink:{color:'#007A70',fontWeight:'900'}
});
