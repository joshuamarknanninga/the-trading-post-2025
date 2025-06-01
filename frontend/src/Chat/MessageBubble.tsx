// trading-post-mobile/src/Chat/MessageBubble.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Message } from '../services/chatService';
import { colors, spacing, typography, radii, shadows } from '../theme';

export type MessageBubbleProps = {
  message: Message;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isMe = message.sender_id === user?.id;

  return (
    <View style={[styles.container, isMe ? styles.myContainer : styles.theirContainer]}>
      <Text style={[styles.text, isMe ? styles.myText : styles.theirText]}>
        {message.content}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(message.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  myContainer: ViewStyle;
  theirContainer: ViewStyle;
  text: TextStyle;
  myText: TextStyle;
  theirText: TextStyle;
  timestamp: TextStyle;
}>({
  container: {
    maxWidth: '80%',
    borderRadius: radii.medium,
    padding: spacing.small,
    marginVertical: spacing.xsmall,
    ...shadows.light,
  },
  myContainer: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  theirContainer: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.body,
    fontSize: typography.size.medium,
  },
  myText: {
    color: colors.background,
  },
  theirText: {
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: typography.size.xsmall,
    color: colors.textSecondary,
    marginTop: spacing.xsmall,
    alignSelf: 'flex-end',
  },
});

export default MessageBubble;
