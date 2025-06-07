// frontend/mobile/components/MobileNav.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import MobileHome from '../screens/MobileHome';
import MobileMap from '../screens/MobileMap';
import MobileWallet from '../screens/MobileWallet';
import MobileProfile from '../screens/MobileProfile';

const Tab = createBottomTabNavigator();

export default function MobileNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingVertical: 6,
            height: 60,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Map':
                iconName = 'map';
                break;
              case 'Wallet':
                iconName = 'wallet';
                break;
              case 'Profile':
                iconName = 'person';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={MobileHome} />
        <Tab.Screen name="Map" component={MobileMap} />
        <Tab.Screen name="Wallet" component={MobileWallet} />
        <Tab.Screen name="Profile" component={MobileProfile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
