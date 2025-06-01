// frontend/components/Footer.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© {new Date().getFullYear()} The Trading Post</Text>

      <View style={styles.links}>
        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}>
          <Text style={styles.link}>Privacy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/terms')}>
          <Text style={styles.link}>Terms</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@tradingpost.com')}>
          <Text style={styles.link}>Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopColor: '#eaeaea',
    borderTopWidth: 1,
  },
  text: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#007bff',
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 8,
    color: '#6c757d',
    fontSize: 14,
  },
});
