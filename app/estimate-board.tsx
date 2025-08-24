import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import Zeroconf from 'react-native-zeroconf';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';

const FIB_NUMBERS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];


function EstimateBoard() {
  const { name, roomId, setRoomId } = useUser();
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [hostFound, setHostFound] = useState(false);
  const [connected, setConnected] = useState(false);
  const [canEstimate, setCanEstimate] = useState(false);
  const [estimationSubmitted, setEstimationSubmitted] = useState(false);
  const [round, setRound] = useState(1);
  const zeroconfRef = useRef<any>(null);

  // Helper functions to reduce nesting in useEffect
  const startEstimation = () => {
    setCanEstimate(true);
  };

  const connectToHost = () => {
    setConnected(true);
    // Simulate host sending signal to start estimation
    setTimeout(startEstimation, 1000);
  };

  // Discover host by roomId using Zeroconf and listen for round events
  useEffect(() => {
    if (!roomId) return;
    const zeroconf = new Zeroconf();
    zeroconfRef.current = zeroconf;
    const handleResolved = (service: any) => {
      if (service.txt?.roomId === roomId) {
        setHostFound(true);
        setTimeout(connectToHost, 1000);
      }
    };
    zeroconf.on('resolved', handleResolved);
    // Listen for round start messages (simulate via found event for demo)
    zeroconf.on('found', (service: any) => {
      if (!service?.txt?.message) return;
      try {
        const msg = JSON.parse(service.txt.message);
        if (msg.type === 'start-round') {
          setRound(msg.round);
          setCanEstimate(true);
          setEstimationSubmitted(false);
          setSelected(null);
        }
      } catch (e) {
        // ignore
      }
    });
    zeroconf.scan('http', 'tcp', 'local.');
    return () => {
      zeroconf.stop();
      zeroconf.removeDeviceListeners();
    };
  }, [roomId]);

  const handleSubmit = () => {
    setEstimationSubmitted(true);
    setCanEstimate(false);
    // Send submission to host (simulate by updating Zeroconf TXT record)
    if (zeroconfRef.current) {
      zeroconfRef.current.publishService(
        'http',
        'tcp',
        'local.',
        name || 'participant',
        42425,
        {
          roomId,
          submission: JSON.stringify({ type: 'submit', round, participantId: name || 'participant', points: selected })
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Pressable
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: '#eee', borderRadius: 16, padding: 6 }}
          onPress={() => {
            setRoomId('');
            router.replace('/select-profile');
          }}
        >
          <MaterialCommunityIcons name="exit-to-app" size={22} color="#333" />
        </Pressable>
        <Text style={styles.header}>Estimation Board</Text>
        <Text style={styles.selectLabel}>Round: <Text style={styles.bold}>{round}</Text></Text>
        <Text style={styles.greeting}>Hello, <Text style={styles.bold}>{name || 'Guest'}</Text>!</Text>
        <Text style={styles.selectLabel}>Room ID: <Text style={styles.bold}>{roomId || 'None'}</Text></Text>
        {!hostFound && <Text style={{ color: '#888', marginBottom: 8 }}>Searching for host...</Text>}
        {hostFound && !connected && <Text style={{ color: '#888', marginBottom: 8 }}>Connecting to host...</Text>}
        {connected && !canEstimate && <Text style={{ color: '#888', marginBottom: 8 }}>Waiting for host to start estimation...</Text>}
        {connected && canEstimate && <Text style={{ color: '#4caf50', marginBottom: 8 }}>You can estimate now!</Text>}
        <Text style={styles.selectLabel}>Select your estimation</Text>
        <View style={styles.fibGrid}>
          {Array.from({ length: Math.ceil(FIB_NUMBERS.length / 4) }).map((_, rowIdx) => {
            const rowNumbers = FIB_NUMBERS.slice(rowIdx * 4, rowIdx * 4 + 4);
            return (
              <View key={rowNumbers[0]} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                {rowNumbers.map(num => (
                  <Pressable
                    key={num}
                    style={[
                      {
                        width: 55,
                        height: 75,
                        marginHorizontal: 6,
                        backgroundColor: selected === num ? '#6c63ff' : '#fff',
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: selected === num ? '#6c63ff' : '#bbb',
                        shadowColor: '#000',
                        shadowOpacity: 0.10,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                    onPress={() => setSelected(num)}
                    disabled={!canEstimate || estimationSubmitted}
                  >
                    <Text style={{
                      fontSize: 28,
                      color: selected === num ? '#fff' : '#6c63ff',
                      fontWeight: 'bold',
                      fontFamily: 'Menlo',
                      textShadowColor: selected === num ? '#4b47b6' : '#eee',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {num}
                    </Text>
                  </Pressable>
                ))}
              </View>
            );
          })}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            (!canEstimate || estimationSubmitted || selected === null) && styles.buttonDisabled,
            pressed && canEstimate && !estimationSubmitted && selected !== null && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!canEstimate || estimationSubmitted || selected === null}
        >
          <Text style={[styles.submitButtonText, { color: '#222', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }]}>🂠 Submit Estimation</Text>
        </Pressable>
        {estimationSubmitted && <Text style={{ color: '#888', marginTop: 8 }}>Estimation submitted. Waiting for next round...</Text>}
      </View>
    </View>
  );
}

export default EstimateBoard;

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
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  roomInfo: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  greeting: {
    fontSize: 16,
    color: '#444',
    marginBottom: 18,
  },
  selectLabel: {
    fontSize: 15,
    color: '#6c63ff',
    fontWeight: '500',
    marginBottom: 10,
  },
  fibGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 10,
  },
  fibButton: {
    backgroundColor: '#f0f0ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fibButtonSelected: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  fibText: {
    fontSize: 18,
    color: '#6c63ff',
    fontWeight: 'bold',
  },
  fibTextSelected: {
    color: '#fff',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#6c63ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
