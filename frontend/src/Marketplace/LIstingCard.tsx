// frontend/components/ListingCard.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ListingCardProps {
  item: {
    id: number;
    title: string;
    image_url: string;
    price?: number;
    location?: string;
  };
  onPress: () => void;
}

export default function ListingCard({ item, onPress }: ListingCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image_url }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>

        {item.price !== undefined && (
          <Text style={styles.price}>${item.price}</Text>
        )}

        {item.location && (
          <Text style={styles.location}>{item.location}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 3,
  },
  image: {
    height: 160,
    width: '100%',
    resizeMode: 'cover',
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#777',
  },
});
