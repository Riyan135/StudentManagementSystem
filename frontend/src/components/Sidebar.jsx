import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  CalendarCheck, 
  GraduationCap, 
  FileText, 
  MessageSquare, 
  Megaphone, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  LogOut,
  UserPlus
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'faculty', 'student', 'parent'] },
    { id: 'profile', label: 'My Profile', icon: User, roles: ['admin', 'faculty', 'student', 'parent'] },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: ['faculty', 'student', 'parent'] },
    { id: 'marks', label: 'Marks & Results', icon: GraduationCap, roles: ['faculty', 'student', 'parent'] },
    { id: 'assignments', label: 'Assignments', icon: FileText, roles: ['faculty', 'student'] },
    { id: 'chat', label: 'Real-time Chat', icon: MessageSquare, roles: ['faculty', 'student', 'parent'] },
    { id: 'notices', label: 'Notice Board', icon: Megaphone, roles: ['admin', 'faculty', 'student', 'parent'] },
    { id: 'fees', label: 'Fees & Payment', icon: CreditCard, roles: ['student', 'parent'] },
    { id: 'timetable', label: 'Timetable', icon: Calendar, roles: ['admin', 'student'] },
    { id: 'feedback', label: 'Feedback / Complaints', icon: AlertTriangle, roles: ['admin', 'faculty', 'student', 'parent'] }
  ];

  // Filter menu items by user role
  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - 40px)',
      position: 'fixed',
      top: '20px',
      left: '20px',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      zIndex: 100,
      borderRight: '1px solid var(--glass-border)'
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        padding: '0 8px'
      }}>
        <div style={{
          background: 'var(--primary-gradient)',
          color: 'white',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '20px',
          boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
        }}>
          S
        </div>
        <div>
          <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: '800' }}>SmartERP</h2>
          <span style={{ fontSize: '11px', color: 'var(--text-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>MCA Project</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '12px',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
              className="menu-button"
            >
              <Icon size={20} style={{ opacity: isActive ? 1 : 0.8 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile Summary */}
      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(15,23,42,0.06)',
        paddingTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
          <img 
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
            alt={user.name} 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name}
            </h4>
            <span style={{ 
              fontSize: '11px', 
              color: 'var(--primary-color)', 
              fontWeight: '600', 
              textTransform: 'uppercase',
              background: 'rgba(37,99,235,0.08)',
              padding: '2px 8px',
              borderRadius: '20px'
            }}>
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '12px',
            background: 'rgba(239,68,68,0.08)',
            color: 'var(--danger)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'var(--transition-smooth)'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
