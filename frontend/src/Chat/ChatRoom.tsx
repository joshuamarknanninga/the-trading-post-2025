// trading-post-mobile/src/Chat/ChatRoom.tsx

import React, { useState, useEffect, useRef } from 'react';
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
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import chatService, { Message } from '../services/chatService';
import Spinner from '../components/Spinner';
import { colors, spacing, typography, radii, shadows } from '../theme';
import { ComponentStyles } from '../styles/components';

type ChatRoomRouteProp = RouteProp<{ params: { roomId: number; roomName: string } }, 'params'>;

const ChatRoom: React.FC = () => {
  const { user, token } = useAuth();
  const socket = React.useContext(SocketContext);
  const route = useRoute<ChatRoomRouteProp>();
  const { roomId, roomName } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);

  // Fetch history
  useEffect(() => {
    let isMounted = true;
    chatService.getMessages(roomId).then((msgs) => {
      if (isMounted) {
        setMessages(msgs);
        setLoading(false);
        // scroll after slight delay
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
      }
    });
    return () => { isMounted = false; };
  }, [roomId]);

  // Subscribe to incoming messages via socket
  useEffect(() => {
    const handleNewMessage = (msg: Message) => {
      if (msg.room_id === roomId) {
        setMessages((prev) => [...prev, msg]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    };
    socket.on('chat:message', handleNewMessage);
    return () => { socket.off('chat:message', handleNewMessage); };
  }, [socket, roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg: Partial<Message> = {
      room_id: roomId,
      sender_id: user!.id,
      content: input.trim(),
    };
    setInput('');
    try {
      await chatService.sendMessage(msg);
      // server will emit and our listener will append
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender_id === user!.id;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{roomName}</Text>
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
          contentContainerStyle={styles.messagesList}
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
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.medium,
    backgroundColor: colors.card,
    ...shadows.medium,
  },
  headerTitle: {
    fontFamily: typography.heading,
    fontSize: typography.size.large,
    color: colors.textPrimary,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: spacing.small,
    paddingBottom: spacing.large + 20, // accommodate input bar
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: radii.medium,
    padding: spacing.small,
    marginVertical: spacing.xsmall,
    ...shadows.light,
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: typography.size.medium,
  },
  myText: {
    color: colors.background,
    fontFamily: typography.body,
  },
  theirText: {
    color: colors.textPrimary,
    fontFamily: typography.body,
  },
  timestamp: {
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
  sendButton: {
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
