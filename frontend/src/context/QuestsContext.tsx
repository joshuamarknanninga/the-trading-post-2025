// trading-post-mobile/src/context/QuestsContext.tsx

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from 'react';
  import questsService from '../services/questsService';
  
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
  
  export interface QuestsContextType {
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
  
  const QuestsContext = createContext<QuestsContextType>({
    quests: [],
    loading: false,
    error: null,
    refresh: async () => {},
    completeQuest: async () => {},
  });
  
  export const QuestsProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [quests, setQuests] = useState<UserQuest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchQuests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await questsService.getQuests();
        setQuests(data);
      } catch (err: any) {
        console.error('Failed to fetch quests:', err);
        setError(err.message || 'Failed to load quests.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchQuests();
    }, []);
  
    const refresh = fetchQuests;
  
    const completeQuest = async (questId: number) => {
      setLoading(true);
      setError(null);
      try {
        await questsService.completeQuest(questId);
        await fetchQuests();
      } catch (err: any) {
        console.error('Failed to complete quest:', err);
        setError(err.message || 'Failed to complete quest.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <QuestsContext.Provider
        value={{ quests, loading, error, refresh, completeQuest }}
      >
        {children}
      </QuestsContext.Provider>
    );
  };
  
  /** Hook to access quest data and actions. Must be used within a <QuestsProvider>. */
  export const useQuests = (): QuestsContextType => {
    const context = useContext(QuestsContext);
    if (!context) {
      throw new Error('useQuests must be used within a QuestsProvider');
    }
    return context;
  };
  