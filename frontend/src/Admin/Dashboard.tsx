// trading-post-mobile/src/Dashboard.tsx

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from './components/Header';
import XPBar from './components/XPBar';
import StreakTracker from './components/StreakTracker';
import QuestList from './components/QuestList';
import Button from './components/Button';

import { GlobalStyles } from './styles/global';
import { ComponentStyles } from './styles/components';

const Dashboard: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={GlobalStyles.screen}>
      <Header title="Dashboard" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* XP Progress */}
        <XPBar />

        {/* Login Streak */}
        <StreakTracker />

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <Button
            title="Map"
            onPress={() => navigation.navigate('Map')}
            style={styles.actionButton}
          />
          <Button
            title="Chat"
            onPress={() => navigation.navigate('Chat')}
            style={styles.actionButton}
          />
          <Button
            title="Wallet"
            onPress={() => navigation.navigate('Wallet')}
            style={styles.actionButton}
          />
        </View>

        {/* Divider */}
        <View style={ComponentStyles.divider} />

        {/* Quests Preview */}
        <View style={styles.section}>
          <QuestList />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  section: {
    marginTop: 16,
  },
});

export default Dashboard;
