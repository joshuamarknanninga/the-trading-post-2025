// trading-post-mobile/src/styles/global.ts

import { StyleSheet } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme';

export const GlobalStyles = StyleSheet.create({
  /** Full-screen container for most screens */
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },

  /** Standard card/container */
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.medium,
    ...shadows.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
  },

  /** Section heading text */
  sectionTitle: {
    fontFamily: typography.heading,
    fontSize: typography.size.large,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },

  /** Default body text */
  text: {
    fontFamily: typography.body,
    fontSize: typography.size.medium,
    color: colors.textSecondary,
  },
});
