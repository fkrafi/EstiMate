
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PARTICIPANTS = [
  { id: '1', name: 'Alice', points: 1 },
  { id: '2', name: 'Bob', points: 2 },
  { id: '3', name: 'Charlie', points: 3 },
];

function generateRoomId() {
  // 8-char alphanumeric
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export default function HostDashboard() {
  const { roomId, setRoomId } = useUser();
  const [participants, setParticipants] = useState(PARTICIPANTS);
  const [round, setRound] = useState(1);

  useEffect(() => {
    if (!roomId) {
      setRoomId(generateRoomId());
    }
  }, [roomId, setRoomId]);

  const displayRoomId = roomId || '--------';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="crown" size={28} color="#FFD700" style={{ marginRight: 8 }} />
          <Text style={styles.header}>Host Dashboard</Text>
        </View>
        <Text style={styles.roomInfo}>
          Room: <Text style={styles.bold}>{displayRoomId}</Text> · Round <Text style={styles.bold}>{round}</Text>
        </Text>
        <View style={styles.roomDetailsSection}>
          <View style={styles.roomDetailsCol}>
            <Text style={styles.label}>Share Room ID</Text>
            <Text style={styles.roomId}>{displayRoomId}</Text>
          </View>
          <Image
            style={styles.qr}
            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${displayRoomId}` }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.participantsHeader}>Participants</Text>
        <FlatList
          data={PARTICIPANTS}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.participantRow,
                { backgroundColor: index % 2 === 1 ? '#f5f5f7' : '#bdbdbd' }
              ]}
            >
              <MaterialCommunityIcons name="account" size={20} color="#555" style={{ marginRight: 8 }} />
              <Text style={styles.participantName}>{item.name}</Text>
              <View style={{ flex: 1 }} />
              <Text style={{ fontSize: 14, color: '#888' }}>{item.points}</Text>
            </View>
          )}
          style={styles.participantsList}
        />
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          {/* Simulate: if all participants have estimated, enable button. Here, all are false so disabled */}
          {/* Replace this logic with your own estimation check */}
          {PARTICIPANTS.every(p => p.points > 0) ? (
            <Text style={{ color: '#4caf50', marginBottom: 8 }}>Ready for next round!</Text>
          ) : (
            <Text style={{ color: '#888', marginBottom: 8 }}>Waiting for all estimates...</Text>
          )}
          <View
            style={{
              backgroundColor: PARTICIPANTS.every(p => p.points > 0) ? '#1976d2' : '#bdbdbd',
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 32,
              opacity: PARTICIPANTS.every(p => p.points > 0) ? 1 : 0.6,
            }}
          >
            <TouchableOpacity
              disabled={!PARTICIPANTS.every(p => p.points > 0)}
              onPress={() => {
                setParticipants(participants.map(p => ({ ...p, points: 0 })));
                setRound(round + 1);
              }}
              style={{
                alignItems: 'center',
                 width: '100%',
                 opacity: PARTICIPANTS.every(p => p.points > 0) ? 1 : 0.6,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                Start Another Round
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7fa',
  },
  card: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  roomInfo: {
    fontSize: 16,
    color: '#444',
    marginBottom: 18,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  roomDetailsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  roomDetailsCol: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  roomId: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: '#333',
  },
  qr: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  participantsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginTop: 8,
  },
  participantsList: {
    maxHeight: 120,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  participantName: {
    fontSize: 15,
    color: '#333',
  },
});
