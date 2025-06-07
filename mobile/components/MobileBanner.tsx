// frontend/mobile/components/MobileBanner.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function MobileBanner() {
  return (
    <LinearGradient
      colors={['#007bff', '#6610f2']}
      style={styles.banner}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={styles.headline}>📦 Trade Locally, Earn Globally</Text>
      <Text style={styles.subtext}>Barter smart. Support your neighbors.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    width,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#eee',
    marginTop: 4,
    textAlign: 'center',
  },
});
