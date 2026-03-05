import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, RefreshControl, ScrollView} from 'react-native';
import {getCurrentUserId} from '../../storage/store';
import {getAnswersByUser} from '../../storage/store';

const ProgressScreen: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (userId === -1) {
      setTotal(0);
      setCorrect(0);
      setLoading(false);
      return;
    }
    const answers = await getAnswersByUser(userId);
    const correctCount = answers.filter((a) => a.isCorrect).length;
    setTotal(answers.length);
    setCorrect(correctCount);
    setLoading(false);
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.title}>进度</Text>
      {loading ? (
        <Text style={styles.hint}>加载中…</Text>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>总答题数</Text>
            <Text style={styles.cardValue}>{total}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>正确题数</Text>
            <Text style={styles.cardValue}>{correct}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>正确率</Text>
            <Text style={styles.cardValue}>{accuracy}%</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  hint: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
  },
});

export default ProgressScreen;
