import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../../api/goals';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { SavingsGoal } from '../../types';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${Math.min(percent, 100)}%` }]} />
    </View>
  );
}

function fmt(value: number | string) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function GoalsScreen() {
  const queryClient = useQueryClient();
  const [depositModal, setDepositModal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => goalsApi.getGoals().then((r) => r.data),
  });

  const depositMutation = useMutation({
    mutationFn: () => goalsApi.addDeposit(depositModal!.id, depositAmount, depositNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setDepositModal(null);
      setDepositAmount('');
      setDepositNote('');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível registrar o depósito.'),
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => goalsApi.updateGoal(id, { status: 'completed' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });

  const statusColors: Record<SavingsGoal['status'], string> = {
    active: '#6200EE',
    completed: '#00C853',
    cancelled: '#999',
  };

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#6200EE" />
      ) : (
        <FlatList
          data={data?.results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma meta cadastrada.</Text>}
          renderItem={({ item }) => {
            const percent =
              Number(item.target_amount) > 0
                ? Math.min((Number(item.current_amount) / Number(item.target_amount)) * 100, 100)
                : 0;

            return (
              <Card>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{item.name}</Text>
                  <Text style={[styles.statusBadge, { color: statusColors[item.status] }]}>
                    {item.status === 'active' ? 'Ativa' : item.status === 'completed' ? 'Concluída' : 'Cancelada'}
                  </Text>
                </View>
                <View style={styles.amounts}>
                  <Text style={styles.currentAmount}>{fmt(item.current_amount)}</Text>
                  <Text style={styles.targetAmount}> / {fmt(item.target_amount)}</Text>
                </View>
                <ProgressBar percent={percent} />
                <Text style={styles.percentText}>{percent.toFixed(1)}%</Text>

                {item.status === 'active' && (
                  <View style={styles.actions}>
                    <Button
                      title="Depositar"
                      onPress={() => setDepositModal(item)}
                      style={styles.actionBtn}
                    />
                    <Button
                      title="Concluir"
                      variant="outline"
                      onPress={() =>
                        Alert.alert('Concluir meta', 'Marcar essa meta como concluída?', [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Confirmar', onPress: () => completeMutation.mutate(item.id) },
                        ])
                      }
                      style={styles.actionBtn}
                    />
                  </View>
                )}
              </Card>
            );
          }}
        />
      )}

      {/* Deposit modal */}
      <Modal visible={!!depositModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Depositar em "{depositModal?.name}"</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Valor (R$)"
              keyboardType="decimal-pad"
              value={depositAmount}
              onChangeText={setDepositAmount}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Observação (opcional)"
              value={depositNote}
              onChangeText={setDepositNote}
              placeholderTextColor="#999"
            />
            <View style={styles.modalActions}>
              <Button title="Cancelar" variant="outline" onPress={() => setDepositModal(null)} style={styles.actionBtn} />
              <Button title="Confirmar" onPress={() => depositMutation.mutate()} loading={depositMutation.isPending} style={styles.actionBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F8' },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalName: { fontSize: 16, fontWeight: '700', color: '#222', flex: 1 },
  statusBadge: { fontSize: 12, fontWeight: '700' },
  amounts: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  currentAmount: { fontSize: 20, fontWeight: '700', color: '#222' },
  targetAmount: { fontSize: 14, color: '#888' },
  progressBg: { height: 8, borderRadius: 4, backgroundColor: '#EEE', marginBottom: 4 },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: '#6200EE' },
  percentText: { fontSize: 12, color: '#888', textAlign: 'right', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 12 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#222', marginBottom: 8 },
  modalInput: { height: 48, borderRadius: 10, borderWidth: 1.5, borderColor: '#DDD', paddingHorizontal: 14, fontSize: 15, color: '#111', backgroundColor: '#FAFAFA' },
  modalActions: { flexDirection: 'row', gap: 10 },
});
