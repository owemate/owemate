import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.logo}>OweMate</Text>
      <Text style={styles.title}>Know who owes whom.</Text>
      <Text style={styles.subtitle}>
        Simple peer-to-peer money tracking for the people you know.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  logo: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#64748B',
    maxWidth: 340,
  },
});
