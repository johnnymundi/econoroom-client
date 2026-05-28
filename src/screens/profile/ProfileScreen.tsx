import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/auth';

export function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.since}>
          Desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}
        </Text>
      </Card>

      <Button title="Sair da conta" variant="danger" onPress={handleLogout} style={styles.logoutBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F8', padding: 20 },
  card: { alignItems: 'center', paddingVertical: 32, marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#6200EE', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: '700' },
  username: { fontSize: 22, fontWeight: '700', color: '#222' },
  email: { fontSize: 15, color: '#666', marginTop: 4 },
  since: { fontSize: 12, color: '#AAA', marginTop: 8 },
  logoutBtn: { marginTop: 'auto' },
});
