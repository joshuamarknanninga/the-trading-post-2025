// trading-post-mobile/src/styles/components.ts

import { StyleSheet } from 'react-native';
import { spacing } from '../theme';

export const ComponentStyles = StyleSheet.create({
  /** Horizontal row layout with vertical padding */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.small,
  },

  /** Center content both vertically and horizontally */
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Make a button or element stretch to full width of its container */
  fullWidthButton: {
    alignSelf: 'stretch',
  },

  /** Subtle horizontal divider line */
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB', // light gray
    marginVertical: spacing.small,
  },

  /** Circular avatar placeholder */
  avatar: {
    width: spacing.large * 2,
    height: spacing.large * 2,
    borderRadius: (spacing.large * 2) / 2,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
