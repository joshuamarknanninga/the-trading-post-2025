// frontend/components/Map/PopupOverlay.tsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

interface PopupOverlayProps {
  coordinate: [number, number];
  title: string;
  description?: string;
  onClose: () => void;
  onAction?: () => void;
}

export default function PopupOverlay({
  coordinate,
  title,
  description,
  onClose,
  onAction,
}: PopupOverlayProps) {
  return (
    <MapboxGL.MarkerView coordinate={coordinate}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
          <View style={styles.actions}>
            {onAction && <Button title="Action" onPress={onAction} />}
            <Button title="Close" color="gray" onPress={onClose} />
          </View>
        </View>
      </View>
    </MapboxGL.MarkerView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
