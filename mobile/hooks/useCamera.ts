// frontend/mobile/hooks/useCamera.ts

import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { Alert } from 'react-native';

export default function useCamera() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera access is required for this feature.');
      }
    })();
  }, []);

  return hasPermission;
}
