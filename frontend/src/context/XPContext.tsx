// trading-post-mobile/src/context/XPContext.tsx

import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
  } from 'react';
  import xpService from '../services/xpService';
  
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
  
  export interface XPContextType {
    /** Latest XP snapshot (or null if not loaded) */
    data: XPData | null;
    /** True while loading or mutating XP data */
    loading: boolean;
    /** Error message if something went wrong */
    error: string | null;
    /** Re-fetch the user's XP data */
    refreshXP: () => Promise<void>;
    /**
     * Award XP to the user.
     * @param amount  Positive integer amount of XP
     * @param source  Source key (e.g. 'trade', 'quest_complete')
     * @param description Optional human-readable note
     */
    addXP: (
      amount: number,
      source: string,
      description?: string
    ) => Promise<void>;
  }
  
  const XPContext = createContext<XPContextType>({
    data: null,
    loading: false,
    error: null,
    refreshXP: async () => {},
    addXP: async () => {},
  });
  
  export const XPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<XPData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    /** Fetch the current XP & level info from the backend */
    const fetchXP = async () => {
      setLoading(true);
      setError(null);
      try {
        const xpSnapshot = await xpService.getXP();
        setData(xpSnapshot);
      } catch (err: any) {
        console.error('XP fetch error:', err);
        setError(err.message || 'Failed to load XP data.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchXP();
    }, []);
  
    const refreshXP = fetchXP;
  
    const addXP = async (
      amount: number,
      source: string,
      description?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        await xpService.addXP(amount, source, description);
        // Re-fetch to get updated totals and level
        await fetchXP();
      } catch (err: any) {
        console.error('XP add error:', err);
        setError(err.message || 'Failed to award XP.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <XPContext.Provider
        value={{ data, loading, error, refreshXP, addXP }}
      >
        {children}
      </XPContext.Provider>
    );
  };
  
  /** Hook to access XP context */
  export const useXP = (): XPContextType => {
    const context = useContext(XPContext);
    if (!context) {
      throw new Error('useXP must be used within an <XPProvider>');
    }
    return context;
  };
  