import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { financesApi } from '../../api/finances';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import type { TransactionType } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'AddTransaction'>;

export function AddTransactionScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => financesApi.getCategories().then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: () =>
      financesApi.createTransaction({
        type,
        amount,
        description,
        date,
        category: categoryId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      navigation.goBack();
    },
    onError: (err: any) => {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar.';
      Alert.alert('Erro', msg);
    },
  });

  const handleSubmit = () => {
    if (!amount || !description || !date) {
      Alert.alert('Preencha todos os campos obrigatórios.');
      return;
    }
    mutation.mutate();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Type toggle */}
        <View style={styles.typeRow}>
          {(['expense', 'income'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, type === t && (t === 'expense' ? styles.typeBtnExpense : styles.typeBtnIncome)]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                {t === 'expense' ? '↓ Despesa' : '↑ Receita'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Valor (R$)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0,00"
        />
        <Input
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Aluguel"
        />
        <Input
          label="Data (AAAA-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2025-01-31"
        />

        {/* Category picker */}
        <Text style={styles.label}>Categoria (opcional)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories?.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, categoryId === cat.id && { backgroundColor: cat.color }]}
              onPress={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
            >
              <Text style={[styles.catChipText, categoryId === cat.id && { color: '#fff' }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Button
          title="Salvar transação"
          onPress={handleSubmit}
          loading={mutation.isPending}
          style={styles.btn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, backgroundColor: '#F4F4F8', flexGrow: 1 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeBtn: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  typeBtnExpense: { backgroundColor: '#D50000', borderColor: '#D50000' },
  typeBtnIncome: { backgroundColor: '#00C853', borderColor: '#00C853' },
  typeBtnText: { fontWeight: '700', color: '#666' },
  typeBtnTextActive: { color: '#fff' },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  catScroll: { marginBottom: 20 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#444' },
  btn: { marginTop: 8 },
});
