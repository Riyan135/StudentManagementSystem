import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import Assignments from './pages/Assignments';
import Chat from './pages/Chat';
import NoticeBoard from './pages/NoticeBoard';
import Fees from './pages/Fees';
import Timetable from './pages/Timetable';
import Feedback from './pages/Feedback';

import './App.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  profile: 'My Profile',
  attendance: 'Attendance Tracker',
  marks: 'Marks & Results',
  assignments: 'Assignments',
  chat: 'Real-time Chat',
  notices: 'Notice Board',
  fees: 'Fees & Payments',
  timetable: 'Timetable & Schedules',
  feedback: 'Feedback & Complaints',
};

// Inner app content rendered after login
const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '48px', height: '48px',
          border: '4px solid rgba(37,99,235,0.15)',
          borderTop: '4px solid var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading SmartERP...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':   return <Dashboard />;
      case 'profile':     return <Profile />;
      case 'attendance':  return <Attendance />;
      case 'marks':       return <Marks />;
      case 'assignments': return <Assignments />;
      case 'chat':        return <Chat />;
      case 'notices':     return <NoticeBoard />;
      case 'fees':        return <Fees />;
      case 'timetable':   return <Timetable />;
      case 'feedback':    return <Feedback />;
      default:            return <Dashboard />;
    }
  };

  return (
    <SocketProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

        {/* Fixed Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main style={{
          marginLeft: 'calc(var(--sidebar-width) + 40px)',
          flex: 1,
          padding: '20px 32px 32px 0',
          minHeight: '100vh',
          overflowX: 'hidden',
          maxWidth: 'calc(100vw - var(--sidebar-width) - 72px)'
        }}>
          <Navbar title={PAGE_TITLES[activeTab] || 'Dashboard'} />
          {renderPage()}
        </main>
      </div>
    </SocketProvider>
  );
};

// Root App wraps with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
