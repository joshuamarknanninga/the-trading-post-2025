// frontend/components/Profile/PublicProfile.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

interface PublicProfileProps {
  email: string;
}

interface Profile {
  name: string;
  bio: string;
  avatar_url: string;
  badges?: string[];
}

export default function PublicProfile({ email }: PublicProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/profile/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load public profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [email]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#007bff" />;
  }

  if (!profile) {
    return <Text style={styles.error}>Profile not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.bio}>{profile.bio}</Text>

      {profile.badges && profile.badges.length > 0 && (
        <>
          <Text style={styles.badgeTitle}>Badges:</Text>
          <FlatList
            data={profile.badges}
            keyExtractor={(badge) => badge}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 12,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
});
