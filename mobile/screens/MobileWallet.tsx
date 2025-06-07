// frontend/mobile/screens/MobileWallet.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';

export default function MobileWallet() {
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email') || '';
    setEmail(storedEmail);

    fetch('http://localhost:5000/api/wallet/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: storedEmail }),
    })
      .then(res => res.json())
      .then(data => setBalance(data.available ? data.available[0].amount / 100 : 0));

    fetch('http://localhost:5000/api/wallet/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: storedEmail }),
    })
      .then(res => res.json())
      .then(setTransactions);
  }, []);

  const sendPayment = () => {
    fetch('http://localhost:5000/api/wallet/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiver_email: recipient, amount }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else alert('Payment sent!');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 My Wallet</Text>
      <Text style={styles.balance}>Balance: ${balance}</Text>

      <View style={styles.paymentBox}>
        <TextInput
          placeholder="Recipient Email"
          value={recipient}
          onChangeText={setRecipient}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Send" onPress={sendPayment} />
      </View>

      <Text style={styles.subheading}>Transactions:</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.transaction}>
            {item.amount / 100} USD — {item.created}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  balance: { fontSize: 18, marginBottom: 20 },
  subheading: { marginTop: 20, fontWeight: '600' },
  transaction: { paddingVertical: 4, color: '#444' },
  paymentBox: { marginBottom: 20, gap: 10 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
