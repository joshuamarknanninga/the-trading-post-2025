// frontend/components/DarkModeToggle.tsx

import React, { useEffect, useState } from 'react';
import { View, Switch, StyleSheet, Text, useColorScheme } from 'react-native';

export default function DarkModeToggle() {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark'
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
    // Add dark mode app state persistence or context theme update here if needed
  };

  return (
    <View style={[styles.container, isDark && styles.darkBackground]}>
      <Text style={[styles.label, isDark && styles.darkText]}>
        Dark Mode: {isDark ? 'ON' : 'OFF'}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleDarkMode}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  darkBackground: {
    backgroundColor: '#000',
  },
  darkText: {
    color: '#fff',
  },
});
