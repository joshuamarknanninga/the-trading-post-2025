// frontend/components/Wallet/WalletDashboard.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';

interface WalletDashboardProps {
  email: string;
}

export default function WalletDashboard({ email }: WalletDashboardProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const balanceRes = await fetch('http://localhost:5000/api/wallet/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const balanceData = await balanceRes.json();
        setBalance(balanceData.available?.[0]?.amount / 100 || 0);

        const txRes = await fetch('http://localhost:5000/api/wallet/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const txData = await txRes.json();
        setTransactions(txData);
      } catch (err) {
        console.error('Error loading wallet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wallet Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Text style={styles.balance}>Balance: ${balance?.toFixed(2)}</Text>

          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transaction}>
                <Text style={styles.txAmount}>${(item.amount / 100).toFixed(2)}</Text>
                <Text style={styles.txDate}>{item.created}</Text>
              </View>
            )}
          />

          <View style={styles.actions}>
            <Button title="Send Payment" onPress={() => {}} />
            <Button title="Request Funds" onPress={() => {}} color="#28a745" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  balance: {
    fontSize: 18,
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  transaction: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  txAmount: {
    fontSize: 16,
    color: '#333',
  },
  txDate: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
