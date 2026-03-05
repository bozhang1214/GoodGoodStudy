import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import type {WrongQuestion} from '../../types';
import {getCurrentUserId} from '../../storage/store';
import {getWrongsByUser} from '../../storage/store';

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

type Props = {
  onReview: (wrongs: WrongQuestion[]) => void;
};

const WrongBookScreen: React.FC<Props> = ({onReview}) => {
  const [items, setItems] = useState<WrongQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (userId === -1) {
      setItems([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    const list = await getWrongsByUser(userId);
    setItems(list);
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

  const handleItemPress = (item: WrongQuestion) => {
    onReview([item]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>错题本</Text>
        <Text style={styles.hint}>加载中…</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>错题本</Text>
        <Text style={styles.empty}>暂无错题</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>错题本</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}>
            <Text style={styles.cardContent} numberOfLines={2}>
              {item.question.content}
            </Text>
            <Text style={styles.cardAnswer}>你的答案: {item.userAnswer}</Text>
            <Text style={styles.cardTime}>{formatTime(item.wrongTime)}</Text>
            <Text style={styles.cardReview}>复习次数: {item.reviewCount}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    fontSize: 15,
    color: '#888',
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 15,
    marginBottom: 8,
  },
  cardAnswer: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  cardReview: {
    fontSize: 12,
    color: '#999',
  },
});

export default WrongBookScreen;
