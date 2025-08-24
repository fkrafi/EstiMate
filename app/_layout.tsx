import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';
import { WebRTCProvider } from '../contexts/WebRTCContext';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';
import appConfig from '../app.json';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://5e479b8ec02c478eb279c2f068238bb8@o4509900505874432.ingest.us.sentry.io/4509900508758016',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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

export default Sentry.wrap(function Layout() {
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
});