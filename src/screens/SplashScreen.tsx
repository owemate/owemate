import { Image, StyleSheet, Text, View } from 'react-native';

// Exported from the Figma splash-screen node. This URL is temporary and should
// be replaced with a committed local asset before the final release build.
const logoMark = 'https://www.figma.com/api/mcp/asset/a11727d4-287a-428d-96a0-361a06467535.svg';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoOuter}>
          <View style={styles.logoCore}>
            <Image source={{ uri: logoMark }} style={styles.logoMark} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.typography}>
          <Text style={styles.brand}>OweMate</Text>
          <Text style={styles.tagline}>Track. Remind. Settle.</Text>
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.activeDot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 384,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3E4FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00685F',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },
  logoCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00685F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#008378',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  logoMark: {
    width: 32,
    height: 30,
  },
  typography: {
    alignItems: 'center',
    paddingTop: 24,
  },
  brand: {
    color: '#0B1C30',
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
  },
  tagline: {
    color: '#3D4947',
    opacity: 0.8,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ translateX: -20 }],
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00685F',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3E4FE',
    marginLeft: 8,
  },
});
