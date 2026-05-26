import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, addNotification } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const socketUrl = window.location.origin.includes('localhost') 
        ? 'http://localhost:5000' 
        : window.location.origin;
      const newSocket = io(socketUrl);
      setSocket(newSocket);

      newSocket.emit('register', user._id);

      newSocket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('notification', (data) => {
        addNotification(data.title, data.message, data.type);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
