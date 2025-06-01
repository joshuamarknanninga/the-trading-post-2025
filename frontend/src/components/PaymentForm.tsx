// frontend/components/PaymentForm.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function PaymentForm() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const sendPayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wallet/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_email: email,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Payment Sent!');
        setEmail('');
        setAmount('');
      } else {
        Alert.alert('Payment Failed', data.error || 'Try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Server connection failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Payment</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipient's Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Amount (USD)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      <Button title="Send" onPress={sendPayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
