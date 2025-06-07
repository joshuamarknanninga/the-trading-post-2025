// frontend/mobile/screens/MobileMap.tsx

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import useGeolocation from '../hooks/useGeolocation';

MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

export default function MobileMap() {
  const { location } = useGeolocation();

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        {location && (
          <MapboxGL.Camera
            zoomLevel={14}
            centerCoordinate={[location.longitude, location.latitude]}
          />
        )}
        {location && (
          <MapboxGL.PointAnnotation
            id="current-location"
            coordinate={[location.longitude, location.latitude]}
          />
        )}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
