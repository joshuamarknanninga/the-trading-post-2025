// trading-post-mobile/src/services/xpService.ts

import api from './api';

export interface Level {
  id: number;
  level_number: number;
  xp_required: number;
  title: string;
  icon?: string;
}

export interface XPData {
  total_xp: number;
  current_level: Level | null;
  next_level: Level | null;
}

/**
 * Service for fetching and awarding user XP & levels.
 */
const xpService = {
  /**
   * Fetch the authenticated user’s XP summary:
   * - total_xp
   * - current_level
   * - next_level
   */
  async getXP(): Promise<XPData> {
    const resp = await api.get<XPData>('/xp/');
    return resp.data;
  },

  /**
   * Award XP to the authenticated user.
   *
   * @param amount      Positive integer amount of XP to add
   * @param source      Source key (e.g. 'trade', 'quest_complete', 'login_streak')
   * @param description Optional human-readable note
   */
  async addXP(
    amount: number,
    source: string,
    description?: string
  ): Promise<void> {
    await api.post('/xp/add', { amount, source, description });
  },
};

export default xpService;

