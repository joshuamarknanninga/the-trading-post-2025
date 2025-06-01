// frontend/components/Map/TradeMap.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import ClusterLogic from './ClusterLogic';
import MapFilters from './MapFilters';
import PopupOverlay from './PopupOverlay';
import mapTheme from './mapTheme.json';

const { width, height } = Dimensions.get('window');

const sampleData = [
  { id: 1, latitude: 37.78925, longitude: -122.4324, title: 'Bike' },
  { id: 2, latitude: 37.78, longitude: -122.43, title: 'Couch' },
  { id: 3, latitude: 37.784, longitude: -122.425, title: 'Books' },
];

export default function TradeMap() {
  const [filters, setFilters] = useState({
    showItems: true,
    showUsers: false,
    showEvents: false,
  });

  const [popup, setPopup] = useState<null | {
    title: string;
    description?: string;
    coord: [number, number];
  }>(null);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        logoEnabled={false}
        onPress={() => setPopup(null)}
      >
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[-122.4324, 37.78825]}
        />

        {filters.showItems && (
          <ClusterLogic
            items={sampleData}
          />
        )}

        {popup && (
          <PopupOverlay
            coordinate={popup.coord}
            title={popup.title}
            description={popup.description}
            onClose={() => setPopup(null)}
          />
        )}
      </MapboxGL.MapView>

      <View style={styles.overlay}>
        <MapFilters
          filters={filters}
          onToggle={(key, val) =>
            setFilters((prev) => ({ ...prev, [key]: val }))
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
});
