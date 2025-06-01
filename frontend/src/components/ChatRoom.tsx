// trading-post-mobile/src/components/ChatRoom.tsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import chatService, { Message } from '../services/chatService';
import Spinner from './Spinner';
import { colors, spacing, typography, radii, shadows } from '../theme';

export interface ChatRoomProps {
  /** Numeric ID of the chat room to join */
  roomId: number;
  /** Display name of the chat room */
  roomName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, roomName }) => {
  const { user } = useAuth();
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);

  // Load chat history
  useEffect(() => {
    let mounted = true;
    chatService.getMessages(roomId).then((msgs) => {
      if (mounted) {
        setMessages(msgs);
        setLoading(false);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
      }
    });
    return () => { mounted = false; };
  }, [roomId]);

  // Listen for new messages
  useEffect(() => {
    const handleNew = (msg: Message) => {
      if (msg.room_id === roomId) {
        setMessages((prev) => [...prev, msg]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    };
    socket.on('chat:message', handleNew);
    return () => { socket.off('chat:message', handleNew); };
  }, [socket, roomId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    try {
      await chatService.sendMessage({
        room_id: roomId,
        sender_id: user!.id,
        content: text,
      });
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender_id === user!.id;
    return (
      <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.text, isMe ? styles.myText : styles.theirText]}>
          {item.content}
        </Text>
        <Text style={styles.ts}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{roomName}</Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <Spinner />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: spacing.medium,
    backgroundColor: colors.card,
    ...shadows.medium,
  },
  headerText: {
    fontFamily: typography.heading,
    fontSize: typography.size.large,
    color: colors.textPrimary,
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: {
    padding: spacing.small,
    paddingBottom: spacing.large + 20,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radii.medium,
    padding: spacing.small,
    marginVertical: spacing.xsmall,
    ...shadows.light,
  },
  myBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  theirBubble: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
  },
  text: { fontFamily: typography.body, fontSize: typography.size.medium },
  myText: { color: colors.background },
  theirText: { color: colors.textPrimary },
  ts: {
    fontSize: typography.size.xsmall,
    color: colors.textSecondary,
    marginTop: spacing.xsmall,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    padding: spacing.small,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.small,
    paddingHorizontal: spacing.small,
    fontFamily: typography.body,
    color: colors.textPrimary,
  },
  sendBtn: {
    marginLeft: spacing.small,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.primary,
    borderRadius: radii.small,
    justifyContent: 'center',
    ...shadows.light,
  },
  sendText: {
    color: colors.background,
    fontFamily: typography.heading,
  },
});

export default ChatRoom;
