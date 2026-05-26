import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  // Helper to autofill demo credentials
  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@college.edu');
      setPassword('admin123');
    } else if (role === 'faculty') {
      setEmail('faculty@college.edu');
      setPassword('faculty123');
    } else if (role === 'student') {
      setEmail('student@college.edu');
      setPassword('student123');
    } else if (role === 'parent') {
      setEmail('parent@college.edu');
      setPassword('parent123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--secondary-gradient)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background blobs for premium glassmorphism overlay */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(37, 99, 235, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        top: '-10%',
        left: '-10%',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(96, 165, 250, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        bottom: '-10%',
        right: '-10%',
        zIndex: 1
      }}></div>

      <div className="glass-panel fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            color: 'white',
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '24px',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}>
            S
          </div>
          <h2 style={{ fontSize: '24px', color: 'white', fontWeight: '800', fontFamily: 'Outfit' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>Secure Student Management System Portal</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            color: '#fca5a5',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. rohan@college.edu" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              marginTop: '10px', 
              padding: '14px', 
              borderRadius: '12px',
              fontSize: '15px'
            }}
          >
            Sign In
          </button>
        </form>


      </div>
    </div>
  );
};

export default Login;
