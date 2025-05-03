// trading-post-mobile/src/screens/LevelDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import XPBar from '../components/XPBar';
import LevelBadge from '../components/LevelBadge';
import useXP from '../hooks/useXP';

const LevelDetailScreen: React.FC = () => {
  const { data, loading, error } = useXP();

  return (
    <View style={styles.container}>
      <Header title="Level Details" showBack />

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && data && (
        <ScrollView contentContainerStyle={styles.content}>
          {/* XP Progress Overview */}
          <XPBar />

          {/* Current Level */}
          <Text style={styles.sectionTitle}>Current Level</Text>
          {data.current_level ? (
            <View style={styles.levelSection}>
              <LevelBadge
                levelNumber={data.current_level.level_number}
                title={data.current_level.title}
                icon={data.current_level.icon ?? undefined}
                style={styles.levelBadge}
              />
              <Text style={styles.levelTitle}>
                Level {data.current_level.level_number}: {data.current_level.title}
              </Text>
              <Text style={styles.levelInfo}>
                Reached at {data.current_level.xp_required.toLocaleString()} XP
              </Text>
            </View>
          ) : (
            <Text style={styles.infoText}>No level achieved yet.</Text>
          )}

          {/* Next Level */}
          <Text style={styles.sectionTitle}>Next Level</Text>
          {data.next_level ? (
            <View style={styles.levelSection}>
              <LevelBadge
                levelNumber={data.next_level.level_number}
                title={data.next_level.title}
                icon={data.next_level.icon ?? undefined}
                style={styles.levelBadge}
              />
              <Text style={styles.levelTitle}>
                Level {data.next_level.level_number}: {data.next_level.title}
              </Text>
              <Text style={styles.levelInfo}>
                You need{' '}
                {(data.next_level.xp_required - data.total_xp).toLocaleString()} XP more
                to reach this level.
              </Text>
            </View>
          ) : (
            <Text style={styles.infoText}>
              🎉 You’ve reached the highest level! Congratulations!
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
  },
  levelSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 3,
  },
  levelBadge: {
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  levelInfo: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
});

export default LevelDetailScreen;
