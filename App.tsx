import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, BackHandler, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AddTransactionScreen } from './src/screens/AddTransactionScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { PeopleScreen } from './src/screens/PeopleScreen';
import { PersonDetailsScreen } from './src/screens/PersonDetailsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { useAppRootState } from './src/screens/AppRoot';

type AppScreen = 'welcome' | 'signin' | 'signup' | 'forgotPassword' | 'resetPassword' | 'dashboard' | 'add' | 'people' | 'personDetails';
export default function App() { return <SafeAreaProvider><AppContent /></SafeAreaProvider>; }
function AppContent() {
  const app = useAppRootState(); const [personScreen,setPersonScreen]=useState<string|null>(null);
  useEffect(()=>{const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{const previous:Partial<Record<AppScreen,AppScreen>>={signin:'welcome',signup:'welcome',forgotPassword:'signin',resetPassword:'signin',add:app.addReturnScreen==='personDetails'?'personDetails':'dashboard',people:'dashboard',personDetails:'people'};const target=previous[app.screen as AppScreen];if(!target)return false;app.clearMessage();app.setScreen(target);return true;});return()=>subscription.remove();},[app.screen,app.addReturnScreen,app.clearMessage,app.setScreen]);
  if(app.loading)return <AppShell><View style={styles.loading}><ActivityIndicator size="large" color="#0F766E"/><Text style={styles.loadingText}>Loading OweMate…</Text></View></AppShell>;
  if(app.screen==='welcome')return <AppShell><WelcomeScreen onSignIn={()=>{app.clearMessage();app.setScreen('signin')}} onSignUp={()=>{app.clearMessage();app.setScreen('signup')}}/></AppShell>;
  if(app.screen==='forgotPassword')return <AppShell><ForgotPasswordScreen email={app.email} submitting={app.authSubmitting} configured={app.configured} message={app.message?.text??null} messageType={app.message?.type??'error'} onEmailChange={app.setEmail} onSubmit={()=>void app.handleForgotPassword()} onBack={()=>{app.clearMessage();app.setScreen('signin')}}/></AppShell>;
  if(app.screen==='resetPassword')return <AppShell><ResetPasswordScreen newPassword={app.newPassword} submitting={app.authSubmitting} message={app.message?.text??null} messageType={app.message?.type??'error'} onChange={app.setNewPassword} onSubmit={()=>void app.handleUpdatePassword()} onBack={()=>{app.clearMessage();app.setScreen('signin')}}/></AppShell>;
  if(app.screen==='signin'||app.screen==='signup')return <AppShell><AuthScreen mode={app.screen} email={app.email} password={app.password} submitting={app.authSubmitting} configured={app.configured} message={app.message?.text??null} messageType={app.message?.type??'error'} onEmailChange={app.setEmail} onPasswordChange={app.setPassword} onSubmit={()=>void app.handleAuth()} onForgotPassword={()=>{app.clearMessage();app.setScreen('forgotPassword')}} onBack={()=>{app.clearMessage();app.setScreen('welcome')}}/></AppShell>;
  if(app.screen==='add')return <AppShell><AddTransactionScreen entryType={app.entryType} person={app.person} amount={app.amount} dueDate={app.dueDate} saving={app.saving} note={app.note} message={app.message?.text??null} onEntryTypeChange={app.setEntryType} onPersonChange={app.setPerson} onAmountChange={app.setAmount} onDueDateChange={app.setDueDate} onNoteChange={app.setNote} onSave={()=>void app.handleSaveTransaction()} onBack={()=>{app.clearMessage();app.setScreen(app.addReturnScreen)}}/></AppShell>;
  if(app.screen==='personDetails'&&personScreen)return <AppShell><PersonDetailsScreen person={personScreen} transactions={app.transactions} onBack={()=>app.setScreen('people')} onAdd={()=>app.startAddTransaction(personScreen,'personDetails')} onToggleSettled={t=>void app.handleToggleSettled(t)}/></AppShell>;
  if(app.screen==='people')return <AppShell><PeopleScreen transactions={app.transactions} onBack={()=>app.setScreen('dashboard')} onSelectPerson={person=>{setPersonScreen(person);app.setScreen('personDetails')}}/></AppShell>;
  return <AppShell><DashboardScreen transactions={app.transactions} onAdd={()=>app.startAddTransaction()} onPeople={()=>app.setScreen('people')} onSignOut={()=>void app.handleSignOut()} onToggleSettled={t=>void app.handleToggleSettled(t)} onDelete={t=>void app.handleDeleteTransaction(t.id)}/></AppShell>;
}
function AppShell({children}:{children:ReactNode}){return <SafeAreaView style={styles.safeArea} edges={['top','bottom','left','right']}><StatusBar style="dark"/>{children}</SafeAreaView>}
const styles=StyleSheet.create({safeArea:{flex:1,backgroundColor:'#F4F7F6'},loading:{flex:1,alignItems:'center',justifyContent:'center',gap:12},loadingText:{color:'#64748B',fontSize:14}});
