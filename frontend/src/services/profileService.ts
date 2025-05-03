// trading-post-mobile/src/services/profileService.ts

import api from './api';

export type UserProfile = {
  id: number;
  full_name: string;
  email: string;
  address?: string;
  spirit_animal?: string;
};

export type Badge = {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  awarded_at?: string;
};

/**
 * Service for user profile operations:
 * - fetch current user’s profile
 * - update profile fields
 * - fetch earned badges
 */
const profileService = {
  /**
   * Retrieve the authenticated user’s profile.
   * GET /api/profile
   */
  async getMe(): Promise<UserProfile> {
    const resp = await api.get<UserProfile>('/profile');
    return resp.data;
  },

  /**
   * Update the authenticated user’s profile.
   * PUT /api/profile
   *
   * @param updates Partial fields to update (e.g. full_name, address, spirit_animal)
   */
  async updateProfile(updates: {
    full_name?: string;
    address?: string;
    spirit_animal?: string;
  }): Promise<void> {
    await api.put('/profile', updates);
  },

  /**
   * Fetch the list of badges the user has earned.
   * GET /api/profile/badges
   */
  async getBadges(): Promise<Badge[]> {
    const resp = await api.get<Badge[]>('/profile/badges');
    return resp.data;
  },
};

export default profileService;
