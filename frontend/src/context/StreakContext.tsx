// trading-post-mobile/src/context/StreakContext.tsx

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from 'react';
  import streakService from '../services/streakService';
  
  export interface StreakInfo {
    current_streak: number;
    longest_streak: number;
    last_login_date: string | null;
    xp_awarded?: number;
    milestone_bonus?: number;
    new_total_xp?: number;
  }
  
  export interface StreakContextType {
    /** Latest streak data (or null if not yet loaded) */
    data: StreakInfo | null;
    /** True while fetching or mutating streak data */
    loading: boolean;
    /** Error message if loading or recording fails */
    error: string | null;
    /** Re-fetch the user's streak info */
    refresh: () => Promise<void>;
    /**
     * Record today's login for streak tracking.
     * Awards daily XP and milestone bonuses on the backend.
     * Returns the updated streak info.
     */
    recordLogin: () => Promise<StreakInfo | null>;
  }
  
  const StreakContext = createContext<StreakContextType>({
    data: null,
    loading: false,
    error: null,
    refresh: async () => {},
    recordLogin: async () => null,
  });
  
  export const StreakProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<StreakInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchStreak = async () => {
      setLoading(true);
      setError(null);
      try {
        const info = await streakService.getStreak();
        setData(info);
      } catch (err: any) {
        console.error('Streak fetch error:', err);
        setError(err.message || 'Failed to load streak info.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchStreak();
    }, []);
  
    const refresh = fetchStreak;
  
    const recordLogin = async (): Promise<StreakInfo | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await streakService.recordLogin();
        const updated: StreakInfo = {
          current_streak: res.current_streak,
          longest_streak: res.longest_streak,
          last_login_date: res.last_login_date,
          xp_awarded: res.xp_awarded,
          milestone_bonus: res.milestone_bonus,
          new_total_xp: res.new_total_xp,
        };
        setData(updated);
        return updated;
      } catch (err: any) {
        console.error('Streak recordLogin error:', err);
        setError(err.message || 'Failed to record login.');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <StreakContext.Provider value={{ data, loading, error, refresh, recordLogin }}>
        {children}
      </StreakContext.Provider>
    );
  };
  
  export const useStreak = (): StreakContextType => {
    const context = useContext(StreakContext);
    if (!context) {
      throw new Error('useStreak must be used within a StreakProvider');
    }
    return context;
  };
  