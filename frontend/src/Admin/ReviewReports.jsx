// trading-post-mobile/src/Admin/ReviewReports.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import Spinner from '../components/Spinner';
import useFetch from '../hooks/useFetch';
import api from '../services/api';
import { GlobalStyles } from '../styles/global';
import { spacing, typography, colors } from '../theme';

export type Report = {
  id: number;
  reporter_id: number;
  reported_user_id: number;
  report_type: string;
  description: string;
  status: 'open' | 'closed';
  created_at: string;
};

const ReviewReports: React.FC = () => {
  const { data: reports, loading, error, refresh } = useFetch<Report[]>('/reports');

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleClose = async (id: number) => {
    try {
      await api.put(`/reports/${id}`, { status: 'closed' });
      Alert.alert('Success', 'Report closed.');
      refresh();
    } catch (err: any) {
      console.error('Error closing report:', err);
      Alert.alert('Error', 'Failed to close report.');
    }
  };

  const renderItem = ({ item }: { item: Report }) => (
    <View style={[GlobalStyles.card, styles.reportCard]}>
      <Text style={styles.title}>
        Report #{item.id} — {item.report_type}
      </Text>
      <Text style={styles.meta}>
        Reported User: {item.reported_user_id}
      </Text>
      <Text style={styles.meta}>Reporter: {item.reporter_id}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={[styles.status, item.status === 'open' ? styles.open : styles.closed]}>
        Status: {item.status.toUpperCase()}
      </Text>
      {item.status === 'open' && (
        <Button title="Close Report" onPress={() => handleClose(item.id)} />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No reports to review.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={{
        refreshing: loading,
        onRefresh: refresh,
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: spacing.medium,
  },
  reportCard: {
    marginBottom: spacing.small,
  },
  title: {
    fontFamily: typography.heading,
    fontSize: typography.size.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xsmall,
  },
  meta: {
    fontFamily: typography.body,
    fontSize: typography.size.small,
    color: colors.textSecondary,
  },
  description: {
    fontFamily: typography.body,
    fontSize: typography.size.medium,
    color: colors.textPrimary,
    marginVertical: spacing.small,
  },
  status: {
    fontFamily: typography.body,
    fontSize: typography.size.small,
    marginBottom: spacing.small,
  },
  open: {
    color: colors.warning,
  },
  closed: {
    color: colors.success,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.medium,
  },
  emptyText: {
    fontFamily: typography.body,
    fontSize: typography.size.medium,
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize: typography.size.medium,
    color: colors.error,
  },
});

export default ReviewReports;
