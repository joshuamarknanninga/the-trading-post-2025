// src/navigation/AppNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import MobileHome from '../screens/MobileHome';
import MobileProfile from '../screens/MobileProfile';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={MobileHome} />
        <Tab.Screen name="Profile" component={MobileProfile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
