// trading-post-mobile/src/services/streakService.ts

import api from './api';

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_login_date: string | null;
  xp_awarded?: number;
  milestone_bonus?: number;
  new_total_xp?: number;
}

/**
 * Service for fetching and recording user login streaks.
 */
const streakService = {
  /**
   * Fetch the authenticated user’s streak info.
   * GET /api/streaks/
   */
  async getStreak(): Promise<StreakInfo> {
    const resp = await api.get<StreakInfo>('/streaks/');
    return resp.data;
  },

  /**
   * Record today’s login for streak tracking.
   * Awards daily XP and milestone bonuses on the backend.
   * POST /api/streaks/login
   *
   * @returns Updated streak info, including any xp_awarded, milestone_bonus, new_total_xp
   */
  async recordLogin(): Promise<StreakInfo> {
    const resp = await api.post<StreakInfo>('/streaks/login');
    return resp.data;
  },
};

export default streakService;
