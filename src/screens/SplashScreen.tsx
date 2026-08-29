import { StyleSheet, Text, View } from 'react-native';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <View style={styles.content}>
        <View style={styles.logoOuter}>
          <View style={styles.logoCore}>
            <Text style={styles.logoMark}>O</Text>
          </View>
        </View>
        <Text style={styles.brand}>OweMate</Text>
        <Text style={styles.tagline}>Track. Remind. Settle.</Text>
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
    backgroundColor: '#F4F7F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#D9F2ED',
    opacity: 0.55,
    top: -130,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoOuter: {
    width: 116,
    height: 116,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  logoCore: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    color: '#FFFFFF',
    fontSize: 43,
    fontWeight: '900',
    marginTop: -2,
  },
  brand: {
    color: '#10201D',
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '900',
    marginTop: 25,
    letterSpacing: -1,
  },
  tagline: {
    color: '#6B7D79',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  progress: {
    position: 'absolute',
    bottom: 34,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 20,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#0F766E',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#BFD4CF',
    marginLeft: 7,
  },
});
