// frontend/components/Profile/EditProfile.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';

interface Profile {
  name: string;
  bio: string;
  avatar_url: string;
}

export default function EditProfile() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('user_email');
      const res = await fetch('http://localhost:5000/api/profile/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const email = localStorage.getItem('user_email');
    const res = await fetch('http://localhost:5000/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, email }),
    });

    const data = await res.json();
    if (res.ok) {
      Alert.alert('Success', 'Profile updated!');
    } else {
      Alert.alert('Error', data.error || 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
      <TextInput
        style={styles.input}
        value={profile.avatar_url}
        onChangeText={(text) => setProfile({ ...profile, avatar_url: text })}
        placeholder="Avatar URL"
      />
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Name"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={profile.bio}
        onChangeText={(text) => setProfile({ ...profile, bio: text })}
        placeholder="Bio"
        multiline
        numberOfLines={4}
      />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
