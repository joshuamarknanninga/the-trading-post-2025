// trading-post-mobile/src/theme/shadows.ts

import { Platform } from 'react-native';

/**
 * Standardized shadow styles for consistent elevation across the app.
 * On iOS, uses shadowColor/offset/opacity/radius.
 * On Android, uses elevation.
 */
export const shadows = {
  /** Very light shadow (e.g. for subtle depth on small elements) */
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  /** Medium shadow (default for cards, buttons, modals) */
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  /** Heavy shadow (for prominent overlays, bottom sheets) */
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
