// frontend/components/MobileNavBar.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type NavItem = {
  label: string;
  onPress: () => void;
  isActive?: boolean;
};

interface MobileNavBarProps {
  items: NavItem[];
}

export default function MobileNavBar({ items }: MobileNavBarProps) {
  return (
    <View style={styles.navbar}>
      {items.map((item, index) => (
        <TouchableOpacity key={index} onPress={item.onPress} style={styles.navItem}>
          <Text style={[styles.navText, item.isActive && styles.activeText]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#444',
  },
  activeText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
