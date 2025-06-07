// frontend/components/Wrapped/TradingWrapped.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';

interface WrappedData {
  totalTrades: number;
  topPartner: string;
  mostTradedItem: string;
  badgesEarned: string[];
}

export default function TradingWrapped({ email }: { email: string }) {
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWrapped = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/wrapped', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load wrapped stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWrapped();
  }, [email]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  if (!data) {
    return <Text style={styles.error}>No data available</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎁 Your Trading Wrapped</Text>
      <Text style={styles.stat}>Total Trades: {data.totalTrades}</Text>
      <Text style={styles.stat}>Top Trading Partner: {data.topPartner}</Text>
      <Text style={styles.stat}>Most Traded Item: {data.mostTradedItem}</Text>

      <Text style={styles.badgeHeader}>🏅 Badges Earned</Text>
      <FlatList
        data={data.badgesEarned}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Text style={styles.badge}>{item}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  stat: {
    fontSize: 16,
    marginBottom: 12,
  },
  badgeHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  badge: {
    fontSize: 14,
    backgroundColor: '#eef',
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
  error: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
