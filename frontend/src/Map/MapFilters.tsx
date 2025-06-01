// frontend/components/Map/MapFilters.tsx

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface MapFiltersProps {
  filters: {
    showItems: boolean;
    showUsers: boolean;
    showEvents: boolean;
  };
  onToggle: (key: keyof MapFiltersProps['filters'], value: boolean) => void;
}

export default function MapFilters({ filters, onToggle }: MapFiltersProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Map Filters</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Show Items</Text>
        <Switch
          value={filters.showItems}
          onValueChange={(val) => onToggle('showItems', val)}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Show Users</Text>
        <Switch
          value={filters.showUsers}
          onValueChange={(val) => onToggle('showUsers', val)}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Show Events</Text>
        <Switch
          value={filters.showEvents}
          onValueChange={(val) => onToggle('showEvents', val)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
  },
});
