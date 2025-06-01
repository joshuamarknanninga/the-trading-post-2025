// trading-post-mobile/src/Badges/BadgeProgress.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Spinner from '../components/Spinner';
import useBadges, { Badge } from '../hooks/useBadges';
import { colors, spacing, radii } from '../theme';

const BadgeProgress: React.FC = () => {
  const { badges, loading, error, refresh } = useBadges();

  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }

  if (error || !badges) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load badge progress.</Text>
      </View>
    );
  }

  const total = badges.length;
  const earned = badges.filter((b: Badge) => !!b.awarded_at).length;
  const progress = total > 0 ? earned / total : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Badges earned: {earned} / {total}
      </Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { flex: progress }]} />
        <View style={[styles.barGap, { flex: 1 - progress }]} />
      </View>
      <Text style={styles.percentage}>
        {(progress * 100).toFixed(0)}%
      </Text>
    </View>
  );
};

const BAR_HEIGHT = 12;

const styles = StyleSheet.create<{
  container: ViewStyle;
  label: TextStyle;
  barBackground: ViewStyle;
  barFill: ViewStyle;
  barGap: ViewStyle;
  percentage: TextStyle;
  errorText: TextStyle;
}>({
  container: {
    marginVertical: spacing.small,
    marginHorizontal: spacing.medium,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xsmall,
    fontWeight: '600',
  },
  barBackground: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    backgroundColor: colors.border,
    borderRadius: radii.small,
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: colors.primary,
  },
  barGap: {
    backgroundColor: 'transparent',
  },
  percentage: {
    marginTop: spacing.xsmall,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
});

export default BadgeProgress;
