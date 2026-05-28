import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { financesApi } from '../../api/finances';
import { Card } from '../../components/ui/Card';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import type { Transaction } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'Transactions'>;

function fmt(value: number | string) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function TransactionsScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState<'income' | 'expense' | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', typeFilter],
    queryFn: () => financesApi.getTransactions({ type: typeFilter }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => financesApi.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });

  const confirmDelete = (item: Transaction) => {
    Alert.alert('Excluir transação', `Excluir "${item.description}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
    ]);
  };

  return (
    <View style={styles.screen}>
      {/* Filter tabs */}
      <View style={styles.tabs}>
        {([undefined, 'income', 'expense'] as const).map((v) => (
          <TouchableOpacity
            key={String(v)}
            style={[styles.tab, typeFilter === v && styles.tabActive]}
            onPress={() => setTypeFilter(v)}
          >
            <Text style={[styles.tabText, typeFilter === v && styles.tabTextActive]}>
              {v === undefined ? 'Todos' : v === 'income' ? 'Receitas' : 'Despesas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#6200EE" />
      ) : (
        <FlatList
          data={data?.results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação encontrada.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={[styles.itemAmount, item.type === 'income' ? styles.income : styles.expense]}>
                  {item.type === 'income' ? '+' : '-'} {fmt(item.amount)}
                </Text>
                <TouchableOpacity onPress={() => confirmDelete(item)}>
                  <Text style={styles.deleteBtn}>🗑</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F8' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center', backgroundColor: '#F0F0F0' },
  tabActive: { backgroundColor: '#6200EE' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#fff' },
  list: { padding: 16, gap: 10 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  item: { flexDirection: 'row', alignItems: 'center' },
  itemLeft: { flex: 1 },
  itemDesc: { fontSize: 15, fontWeight: '600', color: '#222' },
  itemDate: { fontSize: 12, color: '#999', marginTop: 2 },
  itemRight: { alignItems: 'flex-end', gap: 6 },
  itemAmount: { fontSize: 15, fontWeight: '700' },
  income: { color: '#00C853' },
  expense: { color: '#D50000' },
  deleteBtn: { fontSize: 18 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#6200EE', justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#6200EE', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  fabText: { color: '#fff', fontSize: 30, lineHeight: 34 },
});
