// frontend/mobile/hooks/useGeolocation.ts

import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface GeoPosition {
  latitude: number;
  longitude: number;
}

export default function useGeolocation() {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Location Error', 'Permission denied.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  return { location, errorMsg };
}
