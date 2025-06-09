// src/screens/MobileHome.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MobileHome: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Mobile Home</Text>
    </View>
  );
};

export default MobileHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});