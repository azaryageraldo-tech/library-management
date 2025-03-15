import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { isToday, isThisWeek } from 'date-fns';  // Tambahkan import ini

const NotificationContext = createContext(null);
const socket = io('http://localhost:5000');

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    read: 'all',
    date: 'all'
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit('join', { userId: user.id });

      socket.on('notification', (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
      });
    }

    return () => {
      socket.off('notification');
    };
  }, [user]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      const matchesType = filters.type === 'all' || notification.type === filters.type;
      const matchesRead = filters.read === 'all' || 
        (filters.read === 'read' ? notification.read : !notification.read);
      const matchesDate = filters.date === 'all' || 
        (filters.date === 'today' ? isToday(notification.createdAt) : 
         filters.date === 'week' ? isThisWeek(notification.createdAt) : true);
      
      return matchesType && matchesRead && matchesDate;
    });
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications: getFilteredNotifications(), 
        updateFilters,
        filters,
        markAsRead,
        clearAll 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);