// trading-post-mobile/src/hooks/useStreak.ts

import { useState, useEffect, useCallback } from 'react';
import streakService, { StreakInfo } from '../services/streakService';

export interface UseStreakResult {
  /** Latest streak data (or null if not loaded) */
  data: StreakInfo | null;
  /** True while loading or mutating streak data */
  loading: boolean;
  /** Error message, if any */
  error: string | null;
  /** Re-fetch the user's streak info */
  refresh: () => Promise<void>;
  /**
   * Record today's login for the streak.
   * Awards daily XP and milestone bonuses on the backend.
   * Returns updated streak info (including xp_awarded, milestone_bonus, new_total_xp).
   */
  recordLogin: () => Promise<StreakInfo | null>;
}

export default function useStreak(): UseStreakResult {
  const [data, setData] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreak = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await streakService.getStreak();
      setData(info);
    } catch (err: any) {
      console.error('useStreak fetch error:', err);
      setError(err.message || 'Failed to load streak info.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const refresh = fetchStreak;

  const recordLogin = useCallback(async (): Promise<StreakInfo | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await streakService.recordLogin();
      setData(res);
      return res;
    } catch (err: any) {
      console.error('useStreak recordLogin error:', err);
      setError(err.message || 'Failed to record login.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    recordLogin,
  };
}
