import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../contexts/UserContext';

const ROOM_ID = 'ABCD1234';
const ROUND_NUMBER = 1;
const FIB_NUMBERS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export default function EstimateBoard() {
  const { name } = useUser();
  const [selected, setSelected] = useState<number | null>(null);

  const handleSubmit = () => {
    // TODO: Implement submit estimation logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Estimation Board</Text>
        <Text style={styles.roomInfo}>Room: <Text style={styles.bold}>{ROOM_ID}</Text> · Round <Text style={styles.bold}>{ROUND_NUMBER}</Text></Text>
        <Text style={styles.greeting}>Hello, <Text style={styles.bold}>{name || 'Guest'}</Text>!</Text>
        <Text style={styles.selectLabel}>Select your estimation</Text>
        <View style={styles.fibGrid}>
          {FIB_NUMBERS.map(num => (
            <Pressable
              key={num}
              style={[styles.fibButton, selected === num && styles.fibButtonSelected]}
              onPress={() => setSelected(num)}
            >
              <Text style={[styles.fibText, selected === num && styles.fibTextSelected]}>{num}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            selected === null && styles.buttonDisabled,
            pressed && selected !== null && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={selected === null}
        >
          <Text style={styles.submitButtonText}>Submit Estimation</Text>
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
