import { Stack } from 'expo-router';
import React from 'react';
import { UserProvider } from '../contexts/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
}
