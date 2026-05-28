import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { financesApi } from '../../api/finances';
import { Card } from '../../components/ui/Card';

function fmt(value: number | string) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function DashboardScreen() {
  const now = new Date();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['summary', now.getMonth() + 1, now.getFullYear()],
    queryFn: () =>
      financesApi.getSummary(now.getMonth() + 1, now.getFullYear()).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <Text style={styles.heading}>
        {now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
      </Text>

      {/* Balance card */}
      <Card style={[styles.balanceCard]}>
        <Text style={styles.balanceLabel}>Saldo atual</Text>
        <Text style={styles.balanceValue}>{fmt(data?.balance ?? 0)}</Text>
      </Card>

      {/* Income / Expense row */}
      <View style={styles.row}>
        <Card style={[styles.halfCard, { borderLeftColor: '#00C853', borderLeftWidth: 4 }]}>
          <Text style={styles.cardLabel}>Receitas</Text>
          <Text style={[styles.cardValue, { color: '#00C853' }]}>{fmt(data?.income ?? 0)}</Text>
        </Card>
        <Card style={[styles.halfCard, { borderLeftColor: '#D50000', borderLeftWidth: 4 }]}>
          <Text style={styles.cardLabel}>Despesas</Text>
          <Text style={[styles.cardValue, { color: '#D50000' }]}>{fmt(data?.expenses ?? 0)}</Text>
        </Card>
      </View>

      {/* Saldo do mês */}
      <Card>
        <Text style={styles.cardLabel}>Saldo do mês</Text>
        <Text
          style={[
            styles.cardValue,
            { color: (data?.net ?? 0) >= 0 ? '#00C853' : '#D50000' },
          ]}
        >
          {fmt(data?.net ?? 0)}
        </Text>
      </Card>

      {/* By category */}
      {data?.by_category && data.by_category.length > 0 && (
        <Card style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>Despesas por categoria</Text>
          {data.by_category.map((item, i) => (
            <View key={i} style={styles.categoryRow}>
              <View style={[styles.dot, { backgroundColor: item.category__color ?? '#999' }]} />
              <Text style={styles.categoryName}>{item.category__name ?? 'Sem categoria'}</Text>
              <Text style={styles.categoryAmount}>{fmt(item.total)}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F8' },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 20, fontWeight: '700', color: '#222', textTransform: 'capitalize', marginBottom: 4 },
  balanceCard: { backgroundColor: '#6200EE', alignItems: 'center', paddingVertical: 24 },
  balanceLabel: { color: '#E0D4FF', fontSize: 14, marginBottom: 4 },
  balanceValue: { color: '#fff', fontSize: 34, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
  halfCard: { flex: 1 },
  cardLabel: { fontSize: 13, color: '#666', marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#222' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 12 },
  categoryCard: { gap: 0 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  categoryName: { flex: 1, color: '#333', fontSize: 14 },
  categoryAmount: { color: '#D50000', fontWeight: '600', fontSize: 14 },
});
