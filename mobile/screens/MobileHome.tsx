// frontend/mobile/screens/MobileHome.tsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MobileHome() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏕️ Welcome to The Trading Post</Text>
      <Text style={styles.subtitle}>Trade, meet, and explore your community</Text>

      <View style={styles.buttonGroup}>
        <Button title="📍 Open Map" onPress={() => navigation.navigate('Map')} />
        <Button title="💬 Chat" onPress={() => navigation.navigate('Chat')} />
        <Button title="📦 Inventory" onPress={() => navigation.navigate('Inventory')} />
        <Button title="⚙️ Profile" onPress={() => navigation.navigate('Profile')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  buttonGroup: {
    gap: 16,
  },
});
