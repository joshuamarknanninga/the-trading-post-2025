// trading-post-mobile/src/components/QuestList.tsx

import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Spinner from './Spinner';
import QuestCard from './QuestCard';
import useQuests, { UserQuest } from '../hooks/useQuests';

const QuestList: React.FC = () => {
  const {
    quests,
    loading,
    error,
    refresh,
    completeQuest,
  } = useQuests();

  // Fetch quests on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const onRefresh = () => {
    refresh();
  };

  const handleComplete = async (questId: number) => {
    await completeQuest(questId);
    refresh();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!quests || quests.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No quests available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={quests}
      keyExtractor={(item: UserQuest) => item.quest.id.toString()}
      renderItem={({ item }: { item: UserQuest }) => (
        <QuestCard
          quest={item.quest}
          status={item.status}
          progress={item.progress}
          goal={item.goal}
          onComplete={() => handleComplete(item.quest.id)}
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create<{
  centered: ViewStyle;
  listContent: ViewStyle;
  emptyText: TextStyle;
  errorText: TextStyle;
}>({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
});

export default QuestList;
