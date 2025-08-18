import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  name: string;
  setName: (name: string) => void;
  roomId: string;
  setRoomId: (roomId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  return (
    <UserContext.Provider value={{ name, setName, roomId, setRoomId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
