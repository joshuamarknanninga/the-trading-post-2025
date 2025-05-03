// trading-post-mobile/src/components/QuestCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

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

export type QuestCardProps = {
  quest: Quest;
  status: 'pending' | 'completed' | 'claimed';
  progress: number;
  goal: number;
  onComplete: () => void;
};

/**
 * Displays a quest with its title, description, rewards, progress, and a completion button.
 */
const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  status,
  progress,
  goal,
  onComplete,
}) => {
  const isReady = status === 'pending' && progress >= goal;
  const isCompleted = status === 'completed' || status === 'claimed';

  // Icon based on quest type
  const iconName = quest.type === 'daily' ? 'sunny' : 'calendar';
  const iconColor = quest.type === 'daily' ? '#FBBF24' : '#3B82F6';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={iconName} size={24} color={iconColor} />
        <Text style={styles.title}>{quest.title}</Text>
      </View>
      {quest.description ? (
        <Text style={styles.description}>{quest.description}</Text>
      ) : null}

      <View style={styles.infoRow}>
        <Text style={styles.rewardText}>+{quest.xp_reward} XP</Text>
        {quest.token_reward ? (
          <Text style={styles.rewardText}>+{quest.token_reward} T</Text>
        ) : null}
      </View>

      <Text style={styles.progressText}>
        Progress: {Math.min(progress, goal)} / {goal}
      </Text>

      <View style={styles.buttonRow}>
        {isCompleted ? (
          <Text style={styles.completedText}>
            {status === 'claimed' ? 'Reward Claimed' : 'Quest Completed'}
          </Text>
        ) : (
          <Button
            title={isReady ? 'Complete Quest' : 'Not Ready'}
            onPress={onComplete}
            disabled={!isReady}
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  infoRow: ViewStyle;
  rewardText: TextStyle;
  progressText: TextStyle;
  buttonRow: ViewStyle;
  completedText: TextStyle;
  button: ViewStyle;
}>({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
    marginRight: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  buttonRow: {
    alignItems: 'flex-end',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  button: {
    alignSelf: 'flex-end',
  },
});

export default QuestCard;
