// frontend/components/SplashScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      onFinish?.(); // Navigate to login or home
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>The Trading Post</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
