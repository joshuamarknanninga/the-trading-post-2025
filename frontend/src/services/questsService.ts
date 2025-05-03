// trading-post-mobile/src/services/questsService.ts

import api from './api';

export type Quest = {
  id: number;
  title: string;
  description?: string;
  type: 'daily' | 'weekly';
  xp_reward: number;
  token_reward?: number;
  badge_reward?: string;
  is_active: boolean;
};

export type UserQuest = {
  quest: Quest;
  status: 'pending' | 'completed' | 'claimed';
  progress: number;
  goal: number;
  last_updated: string;
};

const questsService = {
  /**
   * Fetch the list of active quests for the current user,
   * along with their status, progress, and goals.
   *
   * GET /api/quests/
   */
  async getQuests(): Promise<UserQuest[]> {
    const resp = await api.get<UserQuest[]>('/quests');
    return resp.data;
  },

  /**
   * Complete a pending quest for the current user.
   * Awards the quest's rewards on the backend.
   *
   * POST /api/quests/{questId}/complete
   *
   * @param questId ID of the quest to complete
   */
  async completeQuest(questId: number): Promise<void> {
    await api.post(`/quests/${questId}/complete`);
  },

  /**
   * Reset daily and weekly quests that have expired for the current user.
   *
   * POST /api/quests/refresh
   */
  async refreshQuests(): Promise<{ quests_reset: number }> {
    const resp = await api.post<{ quests_reset: number }>('/quests/refresh');
    return resp.data;
  },
};

export default questsService;
