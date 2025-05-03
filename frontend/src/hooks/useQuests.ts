// trading-post-mobile/src/hooks/useQuests.ts

import { useState, useEffect, useCallback } from 'react';
import questsService, { UserQuest } from '../services/questsService';

export interface UseQuestsResult {
  /** Array of quests with user progress info */
  quests: UserQuest[];
  /** True while loading or mutating data */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Fetch or re-fetch the user's quests */
  refresh: () => Promise<void>;
  /**
   * Complete a quest by its ID.
   * @param questId ID of the quest to complete
   */
  completeQuest: (questId: number) => Promise<void>;
}

/**
 * Custom hook to manage user quests (daily/weekly).
 * Fetches quests on mount and exposes methods to refresh and complete quests.
 */
export default function useQuests(): UseQuestsResult {
  const [quests, setQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: UserQuest[] = await questsService.getQuests();
      setQuests(data);
    } catch (err: any) {
      console.error('useQuests fetch error:', err);
      setError(err.message || 'Failed to load quests.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quests on initial mount
  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const refresh = fetchQuests;

  const completeQuest = useCallback(
    async (questId: number) => {
      setLoading(true);
      setError(null);
      try {
        await questsService.completeQuest(questId);
        // refresh after completion
        await fetchQuests();
      } catch (err: any) {
        console.error('useQuests completeQuest error:', err);
        setError(err.message || 'Failed to complete quest.');
      } finally {
        setLoading(false);
      }
    },
    [fetchQuests]
  );

  return {
    quests,
    loading,
    error,
    refresh,
    completeQuest,
  };
}
