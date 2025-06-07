// frontend/mobile/screens/MobileProfile.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function MobileProfile() {
  const [email, setEmail] = useState('');
  const [spiritAnimal, setSpiritAnimal] = useState('');

  useEffect(() => {
    // Fetch from localStorage or API
    const storedEmail = localStorage.getItem('user_email');
    setEmail(storedEmail || '');

    // Mock fetch spirit animal
    setSpiritAnimal('🦉 Owl');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    alert('Logged out');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>
      <Text style={styles.label}>Email:</Text>
      <Text>{email}</Text>

      <Text style={styles.label}>Spirit Animal:</Text>
      <Text>{spiritAnimal}</Text>

      <View style={styles.buttonRow}>
        <Button title="Edit Profile" onPress={() => alert('Coming soon')} />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  buttonRow: {
    marginTop: 30,
    gap: 12,
  },
});
