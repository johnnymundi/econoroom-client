import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '../../api/gamification';
import { Card } from '../../components/ui/Card';

const SCREEN_W = Dimensions.get('window').width;
// Room canvas width minus padding
const ROOM_W = SCREEN_W - 32;
const ROOM_H = ROOM_W * 0.65;

// Emoji map for room items — replace with real assets as needed
const ITEM_EMOJI: Record<string, string> = {
  bed: '🛏',
  desk: '🖥',
  wardrobe: '🪟',
  plant: '🪴',
  tv: '📺',
  bookshelf: '📚',
  painting: '🖼',
  rug: '🟫',
};

export function RoomScreen() {
  const { data: room, isLoading: roomLoading } = useQuery({
    queryKey: ['room'],
    queryFn: () => gamificationApi.getRoom().then((r) => r.data),
  });

  const { data: achievements, isLoading: achLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => gamificationApi.getAchievements().then((r) => r.data),
  });

  if (roomLoading || achLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  const unlockedCount = achievements?.filter((a) => a.unlocked).length ?? 0;
  const totalCount = achievements?.length ?? 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>🏠 Minha Sala</Text>
      <Text style={styles.sub}>
        {unlockedCount}/{totalCount} conquistas desbloqueadas
      </Text>

      {/* Room canvas */}
      <View style={styles.room}>
        {room?.items.map((item) => (
          <View
            key={item.id}
            style={[
              styles.roomItem,
              {
                left: item.position_x * ROOM_W - 20,
                top: item.position_y * ROOM_H - 20,
              },
            ]}
          >
            <Text style={styles.roomItemEmoji}>{ITEM_EMOJI[item.asset_key] ?? '📦'}</Text>
          </View>
        ))}
        {(room?.items.length ?? 0) === 0 && (
          <View style={styles.emptyRoom}>
            <Text style={styles.emptyRoomText}>Desbloqueie conquistas{'\n'}para decorar sua sala!</Text>
          </View>
        )}
      </View>

      {/* Achievements list */}
      <Text style={styles.sectionTitle}>Conquistas</Text>
      <FlatList
        data={achievements}
        keyExtractor={(a) => String(a.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card style={[styles.achCard, !item.unlocked && styles.achLocked]}>
            <View style={styles.achRow}>
              <Text style={styles.achEmoji}>
                {item.unlocked ? (ITEM_EMOJI[item.room_item?.asset_key ?? ''] ?? '🏆') : '🔒'}
              </Text>
              <View style={styles.achInfo}>
                <Text style={[styles.achName, !item.unlocked && styles.textMuted]}>{item.name}</Text>
                <Text style={[styles.achDesc, !item.unlocked && styles.textMuted]}>{item.description}</Text>
                {item.unlocked && item.unlocked_at && (
                  <Text style={styles.achDate}>
                    Desbloqueado em {new Date(item.unlocked_at).toLocaleDateString('pt-BR')}
                  </Text>
                )}
              </View>
            </View>
          </Card>
        )}
        contentContainerStyle={{ gap: 10 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F8' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: '700', color: '#222' },
  sub: { fontSize: 13, color: '#888', marginBottom: 16, marginTop: 2 },
  room: {
    width: ROOM_W,
    height: ROOM_H,
    backgroundColor: '#E8E0F7',
    borderRadius: 16,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C9BFEA',
  },
  roomItem: { position: 'absolute', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  roomItemEmoji: { fontSize: 28 },
  emptyRoom: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyRoomText: { color: '#9C8ABF', textAlign: 'center', fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#222', marginBottom: 12 },
  achCard: { padding: 12 },
  achLocked: { opacity: 0.5 },
  achRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  achEmoji: { fontSize: 28, width: 36, textAlign: 'center' },
  achInfo: { flex: 1 },
  achName: { fontSize: 15, fontWeight: '700', color: '#222' },
  achDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  achDate: { fontSize: 11, color: '#6200EE', marginTop: 4 },
  textMuted: { color: '#AAA' },
});
