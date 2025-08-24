import { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import Zeroconf from 'react-native-zeroconf';
import { useUser } from '../contexts/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Participant = { id: string; name: string; points: number };

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
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [round, setRound] = useState<number>(1);
  const [canStartRound, setCanStartRound] = useState<boolean>(true);
  const zeroconfRef = useRef<any>(null);

  // const __DEV__ = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    if (!roomId) {
      Toast.show({ type: 'info', text1: 'Generating new roomId' });
      setRoomId(generateRoomId());
    }
    // Always ensure participants are initialized
    setParticipants((prev: Participant[]) => {
      if (!prev || prev.length === 0) return [];
      return prev;
    });
    // Advertise this device as a host using Bonjour/mDNS
    const zeroconf = new Zeroconf();
    zeroconfRef.current = zeroconf;
    Toast.show({ type: 'info', text1: 'Host Zeroconf started' });
    zeroconf.publishService(
      'http',           // type
      'tcp',            // protocol
      'local.',         // domain
      'estimate',       // name
      42424,            // port (number)
      { roomId: roomId || '' } // txt record
    );
    Toast.show({ type: 'info', text1: 'Service published' });
    console.log('Zeroconf service published for room:', roomId);
    // Listen for participant join and submit messages
    zeroconf.on('found', (service: any) => {
      if (!service?.txt?.message) return;
      try {
        const msg = JSON.parse(service.txt.message);
        // Show ToastAndroid for any received message
        Toast.show({ type: 'info', text1: `P2P: ${JSON.stringify(msg)}` });
        if (msg.type === 'join') {
          Toast.show({ type: 'success', text1: `Participant joined: ${msg.name}` });
        }
        if (msg.type === 'submit') {
          Toast.show({ type: 'success', text1: `Received estimate from: ${msg.participantId}, points: ${msg.points}` });
        }
        if (msg.type === 'join') {
          setParticipants((prev: Participant[]) => {
            if (prev.some(p => p.id === msg.id)) return prev;
            return [...prev, { id: msg.id, name: msg.name, points: -1 }];
          });
          // Broadcast updated participants list to all
          zeroconf.publishService(
            'http',
            'tcp',
            'local.',
            'estimate',
            42424,
            { roomId: roomId || '', message: JSON.stringify({ type: 'participants', participants }) }
          );
        }
        if (msg.type === 'submit' && msg.round === round) {
          setParticipants((prev: Participant[]) => prev.map((p: Participant) =>
            p.id === msg.participantId ? { ...p, points: msg.points } : p
          ));
          // Check if all participants have submitted
          setTimeout(() => {
            if (participants.length > 0 && participants.every((p: Participant) => p.points !== -1)) {
              Toast.show({ type: 'success', text1: 'All participants have submitted!' });
            }
          }, 500);
        }
      } catch (e) {
        Toast.show({ type: 'error', text1: 'Invalid message received', text2: String(e) });
        console.warn('Invalid message', e);
      }
    });
    // Clean up
    return () => {
      Toast.show({ type: 'info', text1: 'Host Zeroconf stopped' });
      zeroconf.stop();
    };
  }, [roomId, setRoomId, round]);

  // Enable next round only when all participants have submitted (points !== -1)
  useEffect(() => {
    if (!canStartRound && participants.length > 0 && participants.every((p: Participant) => p.points !== -1)) {
      setCanStartRound(true);
  Toast.show({ type: 'success', text1: `Round ${round} complete!` });
    }
  }, [participants, canStartRound]);

  // Reset points for new round
  const startNewRound = () => {
    setParticipants((prev: Participant[]) => {
      if (!prev || prev.length === 0) return [];
      return prev.map((p: Participant) => ({ ...p, points: -1 }));
    });
    setRound((r: number) => r + 1);
    setCanStartRound(false);
    Toast.show({ type: 'info', text1: `Starting new round: ${round + 1}` });
    // Broadcast start round message
    if (zeroconfRef.current) {
      zeroconfRef.current.publishService(
        'http',
        'tcp',
        'local.',
        'estimate',
        42424,
        { roomId: roomId || '', message: JSON.stringify({ type: 'start-round', round: round + 1 }) }
      );
    }
  };

  const displayRoomId = roomId || '--------';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: '#eee', borderRadius: 16, padding: 6 }}
          onPress={() => {
            setRoomId('');
            router.replace('/select-profile');
          }}
        >
          <MaterialCommunityIcons name="exit-to-app" size={22} color="#333" />
        </TouchableOpacity>
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
          data={participants}
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
              {item.points === -1 ? (
                <MaterialCommunityIcons name="timer-sand" size={20} color="#ff9800" style={{ marginRight: 4 }} />
              ) : (
                <Text style={{ fontSize: 14, color: '#888' }}>{item.points}</Text>
              )}
            </View>
          )}
          style={styles.participantsList}
        />
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          {canStartRound ? (
            <Text style={{ color: '#4caf50', marginBottom: 8 }}>Ready for next round!</Text>
          ) : (
            <Text style={{ color: '#888', marginBottom: 8 }}>Waiting for all estimates...</Text>
          )}
          <View
            style={{
              backgroundColor: canStartRound ? '#1976d2' : '#bdbdbd',
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 32,
              opacity: canStartRound ? 1 : 0.6,
            }}
          >
            <TouchableOpacity
              disabled={!canStartRound}
              onPress={startNewRound}
              style={{
                alignItems: 'center',
                width: '100%',
                opacity: canStartRound ? 1 : 0.6,
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
};


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
