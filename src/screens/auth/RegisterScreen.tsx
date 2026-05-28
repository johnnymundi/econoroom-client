import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    if (password.length < 8) {
      Alert.alert('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), username.trim(), password);
    } catch (err: any) {
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : 'Não foi possível criar a conta.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>💰 Econoroom</Text>
        <Text style={styles.subtitle}>Crie sua conta</Text>

        <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="voce@email.com" />
        <Input label="Nome de usuário" value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="seunome" />
        <Input label="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholder="Mínimo 8 caracteres" />

        <Button title="Criar conta" onPress={handleRegister} loading={loading} style={styles.btn} />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Entrar</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 28, backgroundColor: '#F4F4F8' },
  logo: { fontSize: 36, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 32 },
  btn: { marginTop: 8 },
  link: { textAlign: 'center', marginTop: 24, color: '#666', fontSize: 14 },
  linkBold: { color: '#6200EE', fontWeight: '700' },
});
