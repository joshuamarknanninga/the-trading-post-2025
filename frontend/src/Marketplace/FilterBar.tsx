// frontend/components/FilterBar.tsx

import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';

interface FilterBarProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export default function FilterBar({ options, selected, onSelect }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {options.map((opt) => {
          const isActive = opt === selected;
          return (
            <Pressable
              key={opt}
              onPress={() => onSelect(opt)}
              style={[styles.button, isActive && styles.activeButton]}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  scroll: {
    paddingHorizontal: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
