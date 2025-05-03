// trading-post-mobile/src/screens/QuestsScreen.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import XPBar from '../components/XPBar';
import StreakTracker from '../components/StreakTracker';
import QuestList from '../components/QuestList';

const QuestsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="Quests & Rewards" />

      {/* Overview section: XP progress and login streak */}
      <View style={styles.overview}>
        <XPBar />
        <StreakTracker />
      </View>

      {/* List of daily/weekly quests */}
      <View style={styles.listContainer}>
        <QuestList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  overview: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  listContainer: {
    flex: 1,
  },
});

export default QuestsScreen;
