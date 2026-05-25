import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(room?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In our environment, the socket server is on the same host/port 3000
    const s = io();

    s.on('connect', () => {
      console.log('Socket.io connected');
      setIsConnected(true);
      if (room) {
        s.emit('join-room', room);
      }
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [room]);

  const sendUpdate = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.emit('send-update', { ...data, room });
    }
  }, [socket, isConnected, room]);

  return { socket, isConnected, sendUpdate };
}
