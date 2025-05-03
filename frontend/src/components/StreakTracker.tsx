// trading-post-mobile/src/components/StreakTracker.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import Spinner from './Spinner';
import useStreak, { StreakInfo } from '../hooks/useStreak';

const StreakTracker: React.FC = () => {
  const { data, loading, error, refresh, recordLogin } = useStreak();
  const [todayRecorded, setTodayRecorded] = useState<boolean>(false);

  // Fetch streak info on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Determine if today's login has already been recorded
  useEffect(() => {
    if (data?.last_login_date) {
      const today = new Date().toISOString().split('T')[0];
      setTodayRecorded(data.last_login_date === today);
    }
  }, [data]);

  const handleRecord = async () => {
    await recordLogin();
    await refresh();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load streak info.</Text>
      </View>
    );
  }

  const { current_streak, longest_streak } = data as StreakInfo;

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={32} color="#F97316" style={styles.icon} />
      <Text style={styles.currentText}>🔥 {current_streak}-day streak</Text>
      <Text style={styles.longestText}>Longest: {longest_streak} days</Text>
      {!todayRecorded && (
        <Button
          title="Record Today's Login"
          onPress={handleRecord}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  icon: ViewStyle;
  currentText: TextStyle;
  longestText: TextStyle;
  button: ViewStyle;
  errorText: TextStyle;
}>({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 3,
  },
  icon: {
    marginBottom: 8,
  },
  currentText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  longestText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  button: {
    alignSelf: 'stretch',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default StreakTracker;
