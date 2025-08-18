import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome6, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

export default function SelectProfile() {
  const router = useRouter();
  const { name } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome{name ? `, ${name}` : ''}!</Text>
        <Text style={styles.subtitle}>Choose your role</Text>
        <Pressable
          style={({ pressed }) => [styles.button, styles.hostButton, pressed && styles.hostButtonPressed]}
          onPress={() => router.push('/host')}
        >
          <MaterialCommunityIcons name="crown" size={28} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Start as Host</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.participantButton, pressed && styles.participantButtonPressed]}
          onPress={() => router.push('/join')}
        >
          <FontAwesome5 name="theater-masks" size={28} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Join as Participant</Text>
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
    backgroundColor: '#f2f6fc',
    padding: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2a3a5e',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7a99',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 18,
    // width: '100%',
    justifyContent: 'center',
    elevation: 2,
    alignSelf: 'stretch', // Added to make button full width
  },
  hostButton: {
    backgroundColor: '#f59e42',
  },
  hostButtonPressed: {
    backgroundColor: '#d97706',
  },
  participantButton: {
    backgroundColor: '#4f8cff',
  },
  participantButtonPressed: {
    backgroundColor: '#2563eb',
  },
  // ...existing code...
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
