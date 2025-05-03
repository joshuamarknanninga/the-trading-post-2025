// trading-post-mobile/src/App.tsx

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox, Platform } from 'react-native';
import { registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseReceivedListener } from './utils/notification';
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
    // Register for push notifications
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          console.log('Push token:', token);
          // TODO: send token to backend tied to authenticated user
        }
      })
      .catch(err => console.warn('Push registration failed', err));

    // Listeners for incoming notifications
    const receivedSub = addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // TODO: handle in-app notification UI
    });
    const responseSub = addNotificationResponseReceivedListener(response => {
      console.log('Notification action response:', response);
      // TODO: navigate or perform action based on response.notification.request.content.data
    });

    return () => {
      if (receivedSub) receivedSub.remove();
      if (responseSub) responseSub.remove();
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
