// frontend/components/Header.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({ title = 'The Trading Post', onBackPress, rightAction }: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.left}>
          <Text style={styles.button}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.left} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.right}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#fff',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  button: {
    fontSize: 20,
    color: '#007bff',
  },
});
