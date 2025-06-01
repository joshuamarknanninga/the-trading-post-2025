// frontend/components/HeroSection.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HeroSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to The Trading Post</Text>
      <Text style={styles.subtext}>Buy, sell, or barter with others near you</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
