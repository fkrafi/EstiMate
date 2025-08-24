import { Stack } from 'expo-router';
import React from 'react';
import { UserProvider } from '../contexts/UserContext';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';

const APP_NAME = 'estimate';
const APP_VERSION = '1.0.2';

export default function Layout() {
  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>{APP_NAME} v{APP_VERSION}</Text>
        </View>
        <Toast />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#f2f6fc',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
