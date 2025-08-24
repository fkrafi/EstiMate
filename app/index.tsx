import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'expo-router';

export default function Home() {
  const [inputName, setInputName] = useState('');
  const { setName } = useUser();
  const router = useRouter();

  const handleContinue = () => {
    setName(inputName);
    router.push('/select-profile');
  Toast.show({ type: 'info', text1: 'Navigating to Select Profile' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialCommunityIcons name="cards-playing-outline" size={56} color="#4f8cff" style={styles.icon} />
        <Text style={styles.title}>EstiMate</Text>
        <Text style={styles.slogan}>Where Clarity Meets Velocity</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={inputName}
          onChangeText={setInputName}
          placeholderTextColor="#aaa"
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            !inputName && styles.buttonDisabled,
            pressed && inputName && styles.buttonPressed
          ]}
          onPress={handleContinue}
          disabled={!inputName}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2a3a5e',
    marginBottom: 4,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 16,
    color: '#6b7a99',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 14 : 10,
    width: '100%',
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#222',
  },
  button: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    opacity: 1,
  },
  buttonDisabled: {
    backgroundColor: '#b6c6e3',
    opacity: 0.7,
  },
  buttonPressed: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
