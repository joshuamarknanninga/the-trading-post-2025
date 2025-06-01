// trading-post-mobile/src/Badges/BadgeGallery.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Spinner from '../components/Spinner';
import useBadges, { Badge } from '../hooks/useBadges';
import { GlobalStyles } from '../styles/global';
import { spacing, typography, colors, radii, shadows } from '../theme';

const BadgeGallery: React.FC = () => {
  const { badges, loading, error, refresh } = useBadges();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <View style={[GlobalStyles.screen, styles.centered]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[GlobalStyles.screen, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={badges}
      numColumns={3}
      keyExtractor={(item: Badge) => item.title}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
      renderItem={({ item }: { item: Badge }) => {
        const owned = !!item.awarded_at;
        return (
          <View
            style={[
              styles.badgeContainer,
              !owned && styles.lockedBadge,
            ]}
          >
            {item.icon ? (
              <Image
                source={{ uri: item.icon }}
                style={styles.icon}
              />
            ) : (
              <View style={styles.placeholderIcon} />
            )}
            <Text
              style={[
                styles.title,
                !owned && styles.lockedText,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>
        );
      }}
    />
  );
};

const BADGE_SIZE = 80;
const BADGE_MARGIN = spacing.small;

const styles = StyleSheet.create<{
  list: ViewStyle;
  badgeContainer: ViewStyle;
  lockedBadge: ViewStyle;
  icon: ImageStyle;
  placeholderIcon: ViewStyle;
  title: TextStyle;
  lockedText: TextStyle;
  errorText: TextStyle;
  centered: ViewStyle;
}>({
  list: {
    padding: spacing.medium,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    width: BADGE_SIZE,
    margin: BADGE_MARGIN / 2,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.medium,
    padding: spacing.small,
    ...shadows.light,
  },
  lockedBadge: {
    opacity: 0.4,
  },
  icon: {
    width: BADGE_SIZE * 0.6,
    height: BADGE_SIZE * 0.6,
    marginBottom: spacing.xsmall,
    resizeMode: 'contain',
  },
  placeholderIcon: {
    width: BADGE_SIZE * 0.6,
    height: BADGE_SIZE * 0.6,
    marginBottom: spacing.xsmall,
    borderRadius: (BADGE_SIZE * 0.6) / 2,
    backgroundColor: colors.border,
  },
  title: {
    fontFamily: typography.body,
    fontSize: typography.size.small,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.body,
    fontSize: typography.size.medium,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BadgeGallery;
