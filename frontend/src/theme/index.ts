// trading-post-mobile/src/theme/index.ts

/**
 * Aggregates all theme tokens for easy import.
 * Provides colors, spacing, typography, radii, and shadows.
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './radii';
export * from './shadows';


import { Platform } from 'react-native';

// standardized shadow styles
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
