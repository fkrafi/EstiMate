import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native';
import { useUser } from '../contexts/UserContext';

export default function JoinRoom() {
  const [roomIdInput, setRoomIdInput] = useState('');
  const { setRoomId } = useUser();
  const router = useRouter();

  const handleJoin = () => {
    setRoomId(roomIdInput);
  Toast.show({ type: 'info', text1: `Joining room: ${roomIdInput}` });
  Sentry.captureMessage(`Joining room: ${roomIdInput}`, { level: 'info' });
    router.push('/estimate-board');
  };

  const handleScan = () => {
  Toast.show({ type: 'info', text1: 'Navigating to QR scanner (not implemented)' });
  Sentry.captureMessage('Navigating to QR scanner (not implemented)', { level: 'info' });
    // Navigate to QR scanner; handle scannedRoomId via context or navigation result
    router.push('/estimate-board');
  };

  const handleBack = () => {
  Toast.show({ type: 'info', text1: 'Back to Select Profile' });
  Sentry.captureMessage('Back to Select Profile', { level: 'info' });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialCommunityIcons name="account-multiple-plus" size={40} color="#6c63ff" style={styles.scanIcon} />
        <Text style={styles.header}>Join Room</Text>
        <Pressable style={[styles.qrButton, { width: '100%', justifyContent: 'center', backgroundColor: '#6c63ff' }]} onPress={handleScan}>
          <MaterialCommunityIcons name="qrcode" size={28} color="#fff" />
          <Text style={[styles.qrButtonText, { color: '#fff' }]}>Scan QR code</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: '100%' }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#e0e0e0' }} />
          <Text style={{ marginHorizontal: 12, color: '#888', fontWeight: '500' }}>OR</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#e0e0e0' }} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter room ID"
          value={roomIdInput}
          onChangeText={setRoomIdInput}
          autoCapitalize="characters"
          maxLength={12}
        />
        <Pressable
          style={({ pressed }) => [
            styles.joinButton,
            (!roomIdInput || roomIdInput.length < 4) && styles.buttonDisabled,
            pressed && roomIdInput && roomIdInput.length >= 4 && styles.buttonPressed,
          ]}
          onPress={handleJoin}
          disabled={!roomIdInput || roomIdInput.length < 4}
        >
          <Text style={styles.joinButtonText}>Join Room</Text>
        </Pressable>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialCommunityIcons name="arrow-left" size={18} color="#6c63ff" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
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
    alignItems: 'center',
  },
  scanIcon: {
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  qrButtonText: {
    marginLeft: 8,
    color: '#6c63ff',
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: '#fafaff',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  joinButton: {
    width: '100%',
    backgroundColor: '#6c63ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  joinButtonText: {
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  backButtonText: {
    color: '#6c63ff',
    fontSize: 15,
    marginLeft: 4,
    fontWeight: '500',
  },
});
