import React, { createContext, useContext, useRef, useState } from 'react';
import { RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import Toast from 'react-native-toast-message';

// Types
interface WebRTCContextType {
  isConnected: boolean;
  sendMessage: (msg: any) => void;
  lastMessage: any;
  startHost: () => Promise<void>;
  joinHost: (offer: any) => Promise<void>;
  localOffer: any;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [localOffer, setLocalOffer] = useState<any>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<any>(null);

  // Host: create offer and wait for answer
  const startHost = async () => {
    peerConnection.current = new RTCPeerConnection();
    dataChannel.current = peerConnection.current.createDataChannel('messaging');
    dataChannel.current.onmessage = (event: { data: any }) => {
      setLastMessage(event.data);
      Toast.show({ type: 'info', text1: '[WebRTC] Host received message', text2: String(event.data) });
    };
    dataChannel.current.onopen = () => {
      setIsConnected(true);
      Toast.show({ type: 'success', text1: '[WebRTC] Host data channel open' });
    };
    dataChannel.current.onclose = () => {
      setIsConnected(false);
      Toast.show({ type: 'error', text1: '[WebRTC] Host data channel closed' });
    };
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      setLocalOffer(offer);
      Toast.show({ type: 'info', text1: '[WebRTC] Host created offer' });
    } catch (e) {
      Toast.show({ type: 'error', text1: '[WebRTC] Host offer error', text2: String(e) });
    }
    // ICE candidate handling omitted for brevity
  };

  // Participant: receive offer, create answer
  const joinHost = async (offer: any) => {
    peerConnection.current = new RTCPeerConnection();
    (peerConnection.current as any).ondatachannel = (event: { channel: any }) => {
      dataChannel.current = event.channel;
      dataChannel.current.onmessage = (e: { data: any }) => {
        setLastMessage(e.data);
        Toast.show({ type: 'info', text1: '[WebRTC] Participant received message', text2: String(e.data) });
      };
      dataChannel.current.onopen = () => {
        setIsConnected(true);
        Toast.show({ type: 'success', text1: '[WebRTC] Participant data channel open' });
      };
      dataChannel.current.onclose = () => {
        setIsConnected(false);
        Toast.show({ type: 'error', text1: '[WebRTC] Participant data channel closed' });
      };
    };
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      Toast.show({ type: 'info', text1: '[WebRTC] Participant created answer' });
    } catch (e) {
      Toast.show({ type: 'error', text1: '[WebRTC] Participant answer error', text2: String(e) });
    }
    // ICE candidate handling omitted for brevity
    // You must send 'answer' back to host via Zeroconf or other signaling
  };

  const sendMessage = (msg: any) => {
    if (dataChannel.current && dataChannel.current.readyState === 'open') {
      dataChannel.current.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
      Toast.show({ type: 'info', text1: '[WebRTC] Sent message', text2: typeof msg === 'string' ? msg : JSON.stringify(msg) });
    } else {
      Toast.show({ type: 'error', text1: '[WebRTC] Data channel not open' });
    }
  };

  const contextValue = React.useMemo(
    () => ({
      isConnected,
      sendMessage,
      lastMessage,
      startHost,
      joinHost,
      localOffer,
    }),
    [isConnected, sendMessage, lastMessage, startHost, joinHost, localOffer]
  );

  return (
    <WebRTCContext.Provider value={contextValue}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const ctx = useContext(WebRTCContext);
  if (!ctx) throw new Error('useWebRTC must be used within a WebRTCProvider');
  return ctx;
};
