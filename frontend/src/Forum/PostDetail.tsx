// frontend/components/Forum/PostDetail.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

interface Reply {
  id: number;
  content: string;
  author: string;
  created: string;
}

export default function PostDetail({ postId, email }: { postId: number; email: string }) {
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');

  const fetchPostDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/forum/post/${postId}`);
      const data = await res.json();
      setPost(data.post);
      setReplies(data.replies || []);
    } catch {
      Alert.alert('Error', 'Could not load post.');
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const submitReply = async () => {
    if (!newReply.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/forum/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: newReply, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setReplies(prev => [...prev, data.reply]);
        setNewReply('');
      } else {
        Alert.alert('Error', data.error || 'Failed to post reply.');
      }
    } catch {
      Alert.alert('Server Error', 'Unable to reach server.');
    }
  };

  if (!post) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>by {post.author}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.created}>{new Date(post.created).toLocaleString()}</Text>

      <Text style={styles.sectionHeader}>Replies</Text>
      {replies.length > 0 ? (
        <FlatList
          data={replies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.replyCard}>
              <Text style={styles.replyAuthor}>{item.author}</Text>
              <Text style={styles.replyContent}>{item.content}</Text>
              <Text style={styles.replyDate}>{new Date(item.created).toLocaleString()}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noReplies}>No replies yet.</Text>
      )}

      <Text style={styles.sectionHeader}>Add a Reply</Text>
      <TextInput
        style={styles.input}
        placeholder="Write a reply..."
        value={newReply}
        onChangeText={setNewReply}
        multiline
      />
      <Button title="Submit Reply" onPress={submitReply} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loading: {
    marginTop: 40,
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  created: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  noReplies: {
    fontSize: 15,
    color: '#999',
    marginBottom: 10,
  },
  replyCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  replyAuthor: {
    fontWeight: '600',
  },
  replyContent: {
    fontSize: 15,
    marginVertical: 4,
  },
  replyDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    marginBottom: 12,
    fontSize: 15,
  },
});
