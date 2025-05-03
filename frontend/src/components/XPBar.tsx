// trading-post-mobile/src/components/XPBar.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Spinner from './Spinner';
import LevelBadge from './LevelBadge';
import useXP from '../hooks/useXP';

const XPBar: React.FC = () => {
  const { data, loading, error } = useXP();

  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load XP data.</Text>
      </View>
    );
  }

  const {
    total_xp,
    current_level,
    next_level,
  } = data;

  // Compute progress fraction between current and next level
  let progress = 1;
  let xpIntoLevel = 0;
  let xpForNextLevel = 0;
  if (current_level && next_level) {
    xpIntoLevel = total_xp - current_level.xp_required;
    xpForNextLevel = next_level.xp_required - current_level.xp_required;
    progress = xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 1;
    progress = Math.max(0, Math.min(progress, 1));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {current_level ? (
          <LevelBadge
            levelNumber={current_level.level_number}
            title={current_level.title}
            icon={current_level.icon}
          />
        ) : (
          <Text style={styles.levelText}>Level 0</Text>
        )}
        <Text style={styles.xpText}>{total_xp} XP</Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { flex: progress }]} />
        <View style={[styles.barGap, { flex: 1 - progress }]} />
      </View>

      {current_level && next_level && (
        <Text style={styles.progressText}>
          {xpIntoLevel} / {xpForNextLevel} XP to Level {next_level.level_number}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: ViewStyle;
  levelText: TextStyle;
  xpText: TextStyle;
  barBackground: ViewStyle;
  barFill: ViewStyle;
  barGap: ViewStyle;
  progressText: TextStyle;
  errorText: TextStyle;
}>({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  xpText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  barBackground: {
    flexDirection: 'row',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#6366F1',
  },
  barGap: {
    backgroundColor: 'transparent',
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default XPBar;
