// frontend/src/App.tsx

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';

import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from './utils/notification';

import AppNavigator from './navigation/AppNavigator';

import { AuthProvider } from './context/AuthContext';
import { XPProvider } from './context/XPContext';
import { StreakProvider } from './context/StreakContext';
import { QuestsProvider } from './context/QuestsContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

// Suppress non-critical warnings
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted from react-native core',
]);

const App: React.FC = () => {
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          console.log('Push token:', token);
        }
      })
      .catch(err => console.warn('Push registration failed', err));

    const receivedSub = addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseSub = addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      receivedSub?.remove();
      responseSub?.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <XPProvider>
        <StreakProvider>
          <QuestsProvider>
            <ThemeProvider>
              <SocketProvider>
                <AppNavigator />
              </SocketProvider>
            </ThemeProvider>
          </QuestsProvider>
        </StreakProvider>
      </XPProvider>
    </AuthProvider>
  );
};

export default App;
