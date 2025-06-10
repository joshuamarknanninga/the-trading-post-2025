// frontend/mobile/screens/MobileChat.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

interface Message {
  id: string;
  sender: string;
  content: string;
}

export default function MobileChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock load
  useEffect(() => {
    setMessages([
      { id: '1', sender: 'Alice', content: 'Hey! You still trading that lamp?' },
      { id: '2', sender: 'You', content: 'Yep! Want to meet at the park?' },
    ]);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={item.sender === 'You' ? styles.userMessage : styles.otherMessage}>
            <Text style={styles.sender}>{item.sender}: </Text>{item.content}
          </Text>
        )}
        contentContainerStyle={styles.messages}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  messages: { paddingBottom: 80 },
  userMessage: { alignSelf: 'flex-end', marginVertical: 4, backgroundColor: '#dcf8c6', padding: 8, borderRadius: 6 },
  otherMessage: { alignSelf: 'flex-start', marginVertical: 4, backgroundColor: '#e6e6e6', padding: 8, borderRadius: 6 },
  sender: { fontWeight: 'bold' },
  inputRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#f1f1f1',
    padding: 6,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    marginRight: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
});
