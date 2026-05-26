import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, BookOpen, Clock, Users, ArrowRight, CheckCircle, GraduationCap } from 'lucide-react';

const BRANCH_SUGGESTIONS = [
  'MCA (Master of Computer Applications)',
  'MBA (Master of Business Administration)',
  'B.Tech (Computer Science & Engineering)',
  'B.Tech (Information Technology)',
  'B.Tech (Electronics & Communication)',
  'M.Tech (Software Engineering)',
  'M.Sc (Computer Science)'
];

const Login = () => {
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register } = useAuth();

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBranch, setRegBranch] = useState('');
  const [branchFocused, setBranchFocused] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: 'student',
      rollNo: regId,
      branch: regBranch.split(' (')[0], // Extract MCA, MBA, etc.
      phone: regPhone
    });

    if (result.success) {
      setSuccess('Registration Successful! Please sign in.');
      setView('login');
      // Copy email to login page for convenience
      setEmail(regEmail);
      // Reset registration form
      setRegName(''); setRegId(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegBranch('');
    } else {
      setError(result.message);
    }
  };

  // Modern Premium Landing View
  if (view === 'landing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(2, 10, 30, 1) 0%, rgba(10, 25, 60, 1) 90%)',
        color: 'white',
        fontFamily: 'Outfit, sans-serif',
        overflowX: 'hidden'
      }}>
        {/* Navigation Bar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 8%',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'var(--primary-gradient)',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '20px'
            }}>
              S
            </div>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' }}>SmartERP</span>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setView('login')}
              style={{
                background: 'none', border: 'none', color: 'white', fontWeight: '600',
                cursor: 'pointer', fontSize: '14px', padding: '10px 20px'
              }}
            >
              Sign In
            </button>
            <button 
              onClick={() => setView('register')}
              className="btn-primary"
              style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '14px' }}
            >
              Register Now
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header style={{
          padding: '120px 8% 80px 8%',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          gap: '60px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <div style={{
              background: 'rgba(37,99,235,0.12)',
              color: '#60a5fa',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '13px',
              fontWeight: '700',
              width: 'fit-content',
              marginBottom: '20px',
              border: '1px solid rgba(37,99,235,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <GraduationCap size={16} /> Next-Gen College ERP Portal
            </div>

            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #ffffff 40%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Empowering Minds, <br />
              <span style={{ color: 'var(--primary-color)' }}>Simplifying Campus.</span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.6',
              marginBottom: '36px',
              maxWidth: '540px'
            }}>
              SmartERP is a beautiful, interactive, and cloud-ready Student Management System. Connect students, faculty, parents, and administrative units in real time.
            </p>

            <div style={{ display: 'flex', gap: '20px' }}>
              <button 
                onClick={() => setView('register')}
                className="btn-primary"
                style={{
                  padding: '16px 32px', borderRadius: '12px', fontSize: '16px',
                  display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700'
                }}
              >
                Register as Student <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setView('login')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                Sign In Portal
              </button>
            </div>
          </div>

          {/* Interactive Feature Visualizer */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', width: '300px', height: '300px',
              background: 'rgba(37,99,235,0.15)', borderRadius: '50%',
              filter: 'blur(80px)', top: '10%', left: '10%'
            }} />

            <div className="glass-panel fade-in" style={{
              padding: '32px',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              position: 'relative',
              zIndex: 2
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '24px', fontWeight: '700' }}>Platform Core Pillars</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: <Shield size={20} color="#10b981" />, title: 'Highly Secure Sessions', desc: 'Secure token validation' },
                  { icon: <Clock size={20} color="#f59e0b" />, title: 'Real-time Live Sync', desc: 'Active communication with Socket.io' },
                  { icon: <BookOpen size={20} color="#3b82f6" />, title: 'Interactive Ledgers', desc: 'Self-service grades, fee payments & timetables' },
                  { icon: <Users size={20} color="#8b5cf6" />, title: 'Unified Dashboards', desc: 'Specialized portals for Student, Faculty, Parent & Admin' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{item.title}</h4>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 0' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }

  // Login View
  if (view === 'login') {
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
        {/* Background blobs */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.15)', borderRadius: '50%', filter: 'blur(80px)', top: '-10%', left: '-10%', zIndex: 1 }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(96, 165, 250, 0.15)', borderRadius: '50%', filter: 'blur(80px)', bottom: '-10%', right: '-10%', zIndex: 1 }} />

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
              background: 'var(--primary-gradient)', color: 'white', width: '48px', height: '48px',
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', fontSize: '24px', margin: '0 auto 16px auto', boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}>
              S
            </div>
            <h2 style={{ fontSize: '24px', color: 'white', fontWeight: '800', fontFamily: 'Outfit' }}>Sign In</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>Access your SmartERP portal dashboard</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', color: '#fca5a5', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px', color: '#a7f3d0', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. student@college.edu" 
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
              style={{ marginTop: '10px', padding: '14px', borderRadius: '12px', fontSize: '15px' }}
            >
              Sign In
            </button>
          </form>

          <p style={{ color: 'var(--text-light)', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
            Don't have a student account?{' '}
            <span 
              onClick={() => { setView('register'); setError(''); setSuccess(''); }}
              style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '700' }}
            >
              Register Here
            </span>
          </p>

          <p style={{ color: 'var(--text-light)', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
            <span onClick={() => setView('landing')} style={{ cursor: 'pointer', opacity: 0.8, textDecoration: 'underline' }}>
              Back to Home
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Registration View with All Requested Student Fields & Branch Suggestions
  if (view === 'register') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--secondary-gradient)',
        padding: '40px 20px',
        position: 'relative',
        overflowY: 'auto'
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.15)', borderRadius: '50%', filter: 'blur(80px)', top: '-10%', left: '-10%', zIndex: 1 }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(96, 165, 250, 0.15)', borderRadius: '50%', filter: 'blur(80px)', bottom: '-10%', right: '-10%', zIndex: 1 }} />

        <div className="glass-panel fade-in" style={{
          width: '100%',
          maxWidth: '500px',
          padding: '40px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          zIndex: 10
        }}>
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              background: 'var(--primary-gradient)', color: 'white', width: '48px', height: '48px',
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', fontSize: '24px', margin: '0 auto 12px auto'
            }}>
              S
            </div>
            <h2 style={{ fontSize: '24px', color: 'white', fontWeight: '800', fontFamily: 'Outfit' }}>Student Registration</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>Complete your profile parameters to sign up</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', color: '#fca5a5', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ID & Name fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Student ID / Roll No</label>
                <input 
                  type="text" 
                  placeholder="e.g. MCA-2026-04" 
                  required 
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  className="glass-input"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rohan Verma" 
                  required 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="glass-input"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
            </div>

            {/* Email & Phone fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@college.edu" 
                  required 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="glass-input"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  required 
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="glass-input"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
            </div>

            {/* Branch Auto-suggestions Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Academic Branch</label>
              <input 
                type="text" 
                placeholder="Type or select branch..." 
                required 
                value={regBranch}
                onFocus={() => setBranchFocused(true)}
                onBlur={() => setTimeout(() => setBranchFocused(false), 200)}
                onChange={(e) => setRegBranch(e.target.value)}
                className="glass-input"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
              
              {/* Dropdown Suggestions */}
              {branchFocused && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  background: '#0d1936',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  marginTop: '6px',
                  zIndex: 200,
                  maxHeight: '180px',
                  overflowY: 'auto',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}>
                  {BRANCH_SUGGESTIONS
                    .filter(b => b.toLowerCase().includes(regBranch.toLowerCase()))
                    .map((branch, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setRegBranch(branch)}
                        style={{
                          padding: '10px 14px',
                          color: 'white',
                          fontSize: '13px',
                          cursor: 'pointer',
                          borderBottom: idx === BRANCH_SUGGESTIONS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {branch}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>Choose Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="glass-input"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ marginTop: '12px', padding: '14px', borderRadius: '12px', fontSize: '15px' }}
            >
              Register & Sign Up
            </button>
          </form>

          <p style={{ color: 'var(--text-light)', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
            Already registered?{' '}
            <span 
              onClick={() => { setView('login'); setError(''); setSuccess(''); }}
              style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '700' }}
            >
              Sign In Here
            </span>
          </p>

          <p style={{ color: 'var(--text-light)', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
            <span onClick={() => setView('landing')} style={{ cursor: 'pointer', opacity: 0.8, textDecoration: 'underline' }}>
              Back to Home
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default Login;
