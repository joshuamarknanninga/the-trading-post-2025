// src/screens/MobileProfile.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MobileProfile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Mobile Profile</Text>
    </View>
  );
};

export default MobileProfile;

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
