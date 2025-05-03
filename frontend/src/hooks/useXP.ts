// trading-post-mobile/src/hooks/useXP.ts

import { useState, useEffect, useCallback } from 'react';
import xpService, { XPData } from '../services/xpService';

export interface UseXPResult {
  /** Latest XP snapshot (or null if not loaded) */
  data: XPData | null;
  /** True while fetching or mutating XP */
  loading: boolean;
  /** Error message if something went wrong */
  error: string | null;
  /** Re-fetch the user's XP data */
  refresh: () => Promise<void>;
  /**
   * Award XP to the user.
   * @param amount      Positive integer XP amount
   * @param source      Source key (e.g. 'trade', 'quest_complete', 'login_streak')
   * @param description Optional human-readable note
   */
  addXP: (amount: number, source: string, description?: string) => Promise<void>;
}

export default function useXP(): UseXPResult {
  const [data, setData] = useState<XPData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchXP = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const xpSnapshot = await xpService.getXP();
      setData(xpSnapshot);
    } catch (err: any) {
      console.error('useXP fetch error:', err);
      setError(err.message || 'Failed to load XP data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchXP();
  }, [fetchXP]);

  const refresh = fetchXP;

  const addXP = useCallback(
    async (amount: number, source: string, description?: string) => {
      setLoading(true);
      setError(null);
      try {
        await xpService.addXP(amount, source, description);
        await fetchXP();
      } catch (err: any) {
        console.error('useXP addXP error:', err);
        setError(err.message || 'Failed to award XP.');
      } finally {
        setLoading(false);
      }
    },
    [fetchXP]
  );

  return { data, loading, error, refresh, addXP };
}
