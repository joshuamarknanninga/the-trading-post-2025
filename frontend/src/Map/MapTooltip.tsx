// frontend/components/Map/MapTooltip.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

interface MapTooltipProps {
  coordinate: [number, number];
  title: string;
  subtitle?: string;
}

export default function MapTooltip({ coordinate, title, subtitle }: MapTooltipProps) {
  return (
    <MapboxGL.PointAnnotation
      id={`tooltip-${title}`}
      coordinate={coordinate}
    >
      <View style={styles.bubble}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <MapboxGL.Callout />
    </MapboxGL.PointAnnotation>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 6,
    maxWidth: 180,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
});
