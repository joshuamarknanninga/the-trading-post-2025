// frontend/components/ItemDetails.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

interface ItemDetailsProps {
  item: {
    id: number;
    name: string;
    image_url: string;
    description?: string;
    category?: string;
    value?: number;
  };
  onTrade?: () => void;
}

export default function ItemDetails({ item, onTrade }: ItemDetailsProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: item.image_url }} style={styles.image} />

      <Text style={styles.title}>{item.name}</Text>

      {item.category && <Text style={styles.category}>Category: {item.category}</Text>}

      {item.description && <Text style={styles.desc}>{item.description}</Text>}

      {item.value !== undefined && (
        <Text style={styles.value}>Estimated Value: ${item.value}</Text>
      )}

      {onTrade && (
        <TouchableOpacity style={styles.button} onPress={onTrade}>
          <Text style={styles.buttonText}>Trade Item</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  category: {
    fontSize: 16,
    color: '#777',
    marginBottom: 4,
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
