// frontend/components/InventoryTab.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface Item {
  id: number;
  name: string;
  image_url: string;
  description?: string;
}

export default function InventoryTab() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Failed to load inventory:', err);
      }
    };

    fetchInventory();
  }, []);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description && <Text style={styles.desc}>{item.description}</Text>}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Trade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 6,
    backgroundColor: '#007bff',
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
