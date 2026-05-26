import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Bell, Search, Users, Check } from 'lucide-react';

const Navbar = ({ title }) => {
  const { notifications, markAllNotificationsRead } = useAuth();
  const { onlineUsers } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      marginBottom: '32px',
      position: 'relative'
    }} className="glass-panel">
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', fontWeight: '800' }}>{title}</h1>
        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Quick Search & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Online Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16,185,129,0.08)',
          color: 'var(--success)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <Users size={16} />
          <span>{onlineUsers.length} Online</span>
        </div>

        {/* Notifications Icon & Popover */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                markAllNotificationsRead();
              }
            }}
            style={{
              background: 'rgba(15,23,42,0.04)',
              border: 'none',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              position: 'relative',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(239,68,68,0.2)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '55px',
              right: '0',
              width: '320px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1000,
              padding: '16px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                paddingBottom: '8px'
              }}>
                <h4 style={{ fontWeight: '700', fontSize: '15px' }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-color)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Check size={14} /> Mark read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-light)', fontSize: '13px' }}>
                  No new notifications
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        background: notif.read ? 'transparent' : 'rgba(37,99,235,0.04)',
                        borderLeft: `3px solid ${
                          notif.type === 'success' ? 'var(--success)' : 
                          notif.type === 'chat' ? 'var(--primary-color)' : 
                          notif.type === 'notice' ? 'var(--warning)' : 'var(--primary-color)'
                        }`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {notif.title}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
