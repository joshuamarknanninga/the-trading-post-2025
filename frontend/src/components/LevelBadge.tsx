// trading-post-mobile/src/components/LevelBadge.tsx

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';

export type LevelBadgeProps = {
  /** Numeric level to display (e.g. 5) */
  levelNumber: number;
  /** Title for this level (e.g. "Market Maven") */
  title: string;
  /** Optional icon for this level (local require or URI) */
  icon?: ImageSourcePropType | string;
  /** Override container style */
  style?: ViewStyle;
  /** Override number text style */
  textStyle?: TextStyle;
  /** Override title text style */
  titleStyle?: TextStyle;
};

/**
 * Displays a circular badge for a user’s level.
 * Shows either a provided icon or the level number,
 * with the level title underneath.
 */
const LevelBadge: React.FC<LevelBadgeProps> = ({
  levelNumber,
  title,
  icon,
  style,
  textStyle,
  titleStyle,
}) => {
  const renderContent = () => {
    if (icon) {
      const source =
        typeof icon === 'string' ? { uri: icon } : icon;
      return <Image source={source} style={styles.icon} />;
    }
    return (
      <Text style={[styles.numberText, textStyle]}>
        {levelNumber}
      </Text>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.circle}>{renderContent()}</View>
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const CIRCLE_SIZE = 48;

const styles = StyleSheet.create<{
  container: ViewStyle;
  circle: ViewStyle;
  numberText: TextStyle;
  icon: ImageStyle;
  title: TextStyle;
}>({
  container: {
    alignItems: 'center',
    width: CIRCLE_SIZE + 16,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 3,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  icon: {
    width: CIRCLE_SIZE * 0.6,
    height: CIRCLE_SIZE * 0.6,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
});

export default LevelBadge;
