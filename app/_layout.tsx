import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';
import { WebRTCProvider } from '../contexts/WebRTCContext';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';
import appConfig from '../app.json';

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

const APP_NAME = appConfig.expo.name;
const APP_VERSION = appConfig.expo.version;

export default function Layout() {
  return (
    <UserProvider>
      <WebRTCProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>{APP_NAME} v{APP_VERSION}</Text>
          </View>
          <Toast />
        </View>
      </WebRTCProvider>
    </UserProvider>
  );
}
