import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financesApi } from '../../api/finances';
import { Card } from '../../components/ui/Card';
import type { Debt } from '../../types';

function fmt(value: number | string) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function DebtsScreen() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['debts'],
    queryFn: () => financesApi.getDebts().then((r) => r.data),
  });

  const payMutation = useMutation({
    mutationFn: (debt: Debt) =>
      financesApi.updateDebt(debt.id, {
        status: 'paid',
        paid_amount: debt.total_amount,
        paid_at: new Date().toISOString(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
    onError: () => Alert.alert('Erro', 'Não foi possível atualizar a dívida.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => financesApi.deleteDebt(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#6200EE" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma dívida cadastrada. 🎉</Text>}
          renderItem={({ item }) => {
            const remaining = Number(item.total_amount) - Number(item.paid_amount);
            return (
              <Card>
                <View style={styles.header}>
                  <Text style={styles.creditor}>{item.creditor}</Text>
                  <Text style={[styles.status, item.status === 'paid' ? styles.statusPaid : styles.statusActive]}>
                    {item.status === 'paid' ? 'Quitada' : 'Ativa'}
                  </Text>
                </View>
                <View style={styles.amounts}>
                  <View>
                    <Text style={styles.amountLabel}>Total</Text>
                    <Text style={styles.amountValue}>{fmt(item.total_amount)}</Text>
                  </View>
                  <View>
                    <Text style={styles.amountLabel}>Restante</Text>
                    <Text style={[styles.amountValue, { color: '#D50000' }]}>{fmt(remaining)}</Text>
                  </View>
                  {item.due_date && (
                    <View>
                      <Text style={styles.amountLabel}>Vencimento</Text>
                      <Text style={styles.amountValue}>{new Date(item.due_date).toLocaleDateString('pt-BR')}</Text>
                    </View>
                  )}
                </View>

                {item.status === 'active' && (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() =>
                      Alert.alert('Quitar dívida', `Marcar "${item.creditor}" como paga?`, [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Confirmar', onPress: () => payMutation.mutate(item) },
                      ])
                    }
                  >
                    <Text style={styles.payBtnText}>✓ Marcar como paga</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    Alert.alert('Excluir', `Excluir dívida de "${item.creditor}"?`, [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Excluir', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
                    ])
                  }
                >
                  <Text style={styles.deleteBtnText}>Excluir</Text>
                </TouchableOpacity>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F8' },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  creditor: { fontSize: 17, fontWeight: '700', color: '#222' },
  status: { fontSize: 12, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusActive: { backgroundColor: '#FFE0E0', color: '#D50000' },
  statusPaid: { backgroundColor: '#E0F9EE', color: '#00C853' },
  amounts: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  amountLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  amountValue: { fontSize: 15, fontWeight: '700', color: '#222' },
  payBtn: { backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 8 },
  payBtnText: { color: '#00C853', fontWeight: '700' },
  deleteBtn: { padding: 8, alignItems: 'center' },
  deleteBtnText: { color: '#B00020', fontSize: 13 },
});
