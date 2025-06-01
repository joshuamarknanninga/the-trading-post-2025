// frontend/components/WalletSummary.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function WalletSummary({ email }: { email: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/wallet/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        const cents = data.available?.[0]?.amount ?? 0;
        setBalance(cents / 100);
      } catch {
        setBalance(0);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/wallet/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setTransactions(data);
      } catch {
        setTransactions([]);
      }
    };

    fetchBalance();
    fetchTransactions();
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>Wallet Balance: ${balance?.toFixed(2)}</Text>
      <Text style={styles.title}>Transaction History:</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text style={styles.amount}>${(item.amount / 100).toFixed(2)}</Text>
            <Text style={styles.date}>{new Date(item.created * 1000).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  balance: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  transaction: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  amount: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});
