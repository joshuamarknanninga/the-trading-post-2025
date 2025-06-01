// frontend/components/Forum/NewPostForm.tsx

import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert } from 'react-native';

export default function NewPostForm({ email, onSuccess }: { email: string; onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submitPost = async () => {
    if (!title || !content) {
      Alert.alert('Validation', 'Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/forum/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Post Created');
        setTitle('');
        setContent('');
        onSuccess?.();
      } else {
        Alert.alert('Error', data.error || 'Could not create post.');
      }
    } catch {
      Alert.alert('Server Error', 'Could not reach the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Post Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Write your post..."
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Submit" onPress={submitPost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
