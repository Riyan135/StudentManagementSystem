import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, BookOpen, Clock, Users, ArrowRight, CheckCircle, 
  GraduationCap, ChevronDown, Award, Laptop, Key, FileText, CheckCircle2,
  Mail, Phone, MapPin, Menu, X, Sun, Moon
} from 'lucide-react';

const BRANCH_SUGGESTIONS = [
  'MCA (Master of Computer Applications)',
  'BCA (Bachelor of Computer Applications)',
  'MBA (Master of Business Administration)',
  'BBA (Bachelor of Business Administration)',
  'B.Com (Bachelor of Commerce)',
  'B.E (Bachelor of Engineering)',
  'Nursing (B.Sc / GNM Nursing)',
  'B.Tech (Computer Science & Engineering)',
  'B.Tech (Information Technology)',
  'B.Tech (Electronics & Communication)',
  'M.Tech (Software Engineering)',
  'M.Tech (Computer Science)',
  'M.Sc (Computer Science)'
];

const Login = () => {
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'register'
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Auth contexts
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

  // Smooth scroll helper
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      branch: regBranch.split(' (')[0],
      phone: regPhone
    });

    if (result.success) {
      setSuccess('Registration Successful! Please sign in with your email & password.');
      setView('login');
      setEmail(regEmail);
      setRegName(''); setRegId(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegBranch('');
    } else {
      setError(result.message);
    }
  };

  // Modern Professional SaaS Landing View
  if (view === 'landing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: darkMode 
          ? 'radial-gradient(circle at 10% 20%, #030a1e 0%, #07122a 90%)' 
          : '#f8fafc',
        color: darkMode ? '#ffffff' : '#0f172a',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        overflowX: 'hidden',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        {/* Navigation Bar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 8%',
          position: 'sticky',
          top: 0,
          background: darkMode ? 'rgba(7, 18, 42, 0.85)' : 'rgba(248, 250, 252, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
              color: 'white',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px'
            }}>
              E
            </div>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>EduAuthority</span>
          </div>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            {['Home', 'Features', 'How It Works', 'Dashboard', 'FAQ', 'Contact'].map((item) => (
              <span 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: darkMode ? 'rgba(255,255,255,0.7)' : '#475569',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#2563eb'}
                onMouseOut={e => e.currentTarget.style.color = darkMode ? 'rgba(255,255,255,0.7)' : '#475569'}
              >
                {item}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Dark Mode toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: darkMode ? '#fbbf24' : '#475569', display: 'flex', alignItems: 'center'
              }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => setView('login')}
              style={{
                background: 'none', border: 'none', color: darkMode ? 'white' : '#0f172a', fontWeight: '600',
                cursor: 'pointer', fontSize: '14px', padding: '10px 16px'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => setView('register')}
              className="btn-primary"
              style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}
            >
              Get Started
            </button>
            
            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? 'white' : '#0f172a', display: 'none' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: 'fixed', top: '79px', left: 0, width: '100%',
            background: darkMode ? '#07122a' : '#f8fafc',
            borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '24px 8%',
            display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 999
          }}>
            {['Home', 'Features', 'How It Works', 'Dashboard', 'FAQ', 'Contact'].map((item) => (
              <span 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                style={{ fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* CSS Helper for Responsive Layouts */}
        <style>{`
          @media (max-width: 991px) {
            .desktop-menu { display: none !important; }
            .mobile-toggle { display: block !important; }
            .hero-section { grid-template-columns: 1fr !important; text-align: center; }
            .hero-actions { justify-content: center; }
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 576px) {
            .stats-grid { grid-template-columns: 1fr !important; }
            .hero-actions { flex-direction: column; width: 100%; }
          }
        `}</style>

        {/* Hero Section */}
        <header id="home" className="hero-section" style={{
          padding: '100px 8% 80px 8%',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          gap: '60px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <div style={{
              background: 'rgba(37,99,235,0.1)',
              color: '#3b82f6',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '13px',
              fontWeight: '700',
              width: 'fit-content',
              marginBottom: '20px',
              border: '1px solid rgba(37,99,235,0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <GraduationCap size={16} /> Campus ERP Excellence
            </div>

            <h1 style={{
              fontSize: '52px',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '20px',
              letterSpacing: '-1px'
            }}>
              Your Complete <br />
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Student Management</span> <br />
              Solution
            </h1>

            <p style={{
              fontSize: '17px',
              color: darkMode ? 'rgba(255,255,255,0.7)' : '#475569',
              lineHeight: '1.6',
              marginBottom: '32px',
              maxWidth: '540px'
            }}>
              Easily manage students, attendance, records, admins, and campus activities in one secure, high-speed campus administration platform.
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setView('register')}
                className="btn-primary"
                style={{
                  padding: '16px 28px', borderRadius: '12px', fontSize: '15px',
                  display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700'
                }}
              >
                Get Started <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  color: darkMode ? 'white' : '#0f172a',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseOver={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                onMouseOut={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Clean Dashboard Preview & Floating Elements */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', width: '300px', height: '300px',
              background: 'rgba(37,99,235,0.15)', borderRadius: '50%',
              filter: 'blur(85px)', top: '10%', left: '10%'
            }} />

            {/* Dashboard Mockup Panel */}
            <div className="glass-panel fade-in" style={{
              padding: '24px',
              borderRadius: '20px',
              background: darkMode ? 'rgba(13, 25, 54, 0.6)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '420px',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }} />
                  <span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '50%' }} />
                  <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }} />
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(128,128,128,0.6)' }}>EduAuthority Core stats</span>
              </div>
              
              <div style={{ background: darkMode ? '#07122a' : '#f1f5f9', padding: '14px', borderRadius: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>TODAY ATTENDANCE</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800' }}>92.8% Verified</span>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>+2.4%</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: darkMode ? '#07122a' : '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(128,128,128,0.8)' }}>Active Admins</span>
                  <p style={{ fontSize: '18px', fontWeight: '800', marginTop: '2px' }}>14 Active</p>
                </div>
                <div style={{ background: darkMode ? '#07122a' : '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(128,128,128,0.8)' }}>Security Logs</span>
                  <p style={{ fontSize: '18px', fontWeight: '800', marginTop: '2px', color: '#10b981' }}>Secure SSL</p>
                </div>
              </div>
            </div>

            {/* Floating micro indicators */}
            <div style={{
              position: 'absolute', top: '-20px', right: '10px',
              background: '#10b981', color: 'white', padding: '6px 14px',
              borderRadius: '20px', fontSize: '12px', fontWeight: '800',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)', zIndex: 10
            }}>
              ⚡ Live Socket Connection
            </div>
          </div>
        </header>

        {/* About Section */}
        <section id="about" style={{
          padding: '80px 8%', background: darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
          borderTop: darkMode ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)',
          borderBottom: darkMode ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>About EduAuthority</h2>
            <p style={{
              fontSize: '18px',
              color: darkMode ? 'rgba(255,255,255,0.76)' : '#475569',
              lineHeight: '1.7',
              fontWeight: '500'
            }}>
              EduAuthority is a smart and secure student management platform designed to simplify administration, organize student data, and improve campus management. Our technology framework helps modern academic institutes automate daily overheads, leaving teachers more time to teach.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" style={{ padding: '80px 8%', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { title: '12,500+', desc: 'Students Managed' },
              { title: '99.9%', desc: 'Attendance Records Logged' },
              { title: '150+', desc: 'Admin Users Registered' },
              { title: '256-bit', desc: 'Secure System SSL' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{
                  padding: '30px 20px', textAlign: 'center',
                  background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
                }}
              >
                <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>{stat.title}</h3>
                <p style={{ fontSize: '14px', color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569', fontWeight: '600' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{
          padding: '80px 8%',
          background: darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Comprehensive Feature Set</h2>
              <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569' }}>Everything required to pilot a professional college campus ecosystem</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {[
                { 
                  icon: <Users size={24} color="#3b82f6" />, 
                  title: 'Student Management', 
                  points: ['Add and manage student details', 'Robust student records management'] 
                },
                { 
                  icon: <Clock size={24} color="#f59e0b" />, 
                  title: 'Attendance Tracking', 
                  points: ['Mark attendance', 'View attendance reports'] 
                },
                { 
                  icon: <Shield size={24} color="#10b981" />, 
                  title: 'Admin Management', 
                  points: ['Super Admin access privileges', 'Sub Admin permissions'] 
                },
                { 
                  icon: <FileText size={24} color="#8b5cf6" />, 
                  title: 'Reports & Analytics', 
                  points: ['Detailed student reports', 'Class attendance reports'] 
                },
                { 
                  icon: <Key size={24} color="#ec4899" />, 
                  title: 'Secure Login', 
                  points: ['Role-based authentication routing', 'Protected dashboard interfaces'] 
                }
              ].map((feat, idx) => (
                <div 
                  key={idx} 
                  className="glass-panel" 
                  style={{
                    padding: '32px',
                    background: darkMode ? 'rgba(13,25,54,0.3)' : 'white',
                    borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(37,99,235,0.08)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                  }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>{feat.title}</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {feat.points.map((p, pIdx) => (
                      <li key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: darkMode ? 'rgba(255,255,255,0.7)' : '#475569' }}>
                        <CheckCircle size={14} color="#10b981" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" style={{ padding: '80px 8%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>How It Works</h2>
            <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569' }}>Quick and automated configuration steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', position: 'relative' }}>
            {[
              { step: '01', title: 'Login to Dashboard', desc: 'Securely sign into the centralized management portal' },
              { step: '02', title: 'Add Students & Admins', desc: 'Populate class departments and specify roles' },
              { step: '03', title: 'Manage Records Easily', desc: 'Monitor grades, timetables, active attendance, and payments' }
            ].map((st, idx) => (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{
                  padding: '40px 30px', position: 'relative',
                  background: darkMode ? 'rgba(255,255,255,0.01)' : 'white',
                  borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
                }}
              >
                <span style={{ fontSize: '64px', fontWeight: '900', color: 'rgba(37,99,235,0.15)', position: 'absolute', top: '10px', right: '20px', lineHeight: 1 }}>
                  {st.step}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>{st.title}</h3>
                <p style={{ fontSize: '13px', color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569', lineHeight: '1.6' }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section id="dashboard" style={{
          padding: '80px 8%', background: darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Core Dashboard Panels</h2>
              <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569' }}>Specialized portals tailored for campus operations</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {[
                { title: 'Student Dashboard', val: 'Visual CGPA analytics, assignments, timetable calendars, and payment receipt systems.' },
                { title: 'Attendance Panel', val: 'Interactive monthly calendars, daily trackers, and live alerts.' },
                { title: 'Admin Management', val: 'Manage student enrollments, edit branch catalogs, and release official notice announcements.' },
                { title: 'Analytical Reports', val: 'Generate PDF summaries, attendance audits, and score graphs.' }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className="glass-panel" 
                  style={{
                    padding: '24px',
                    background: darkMode ? 'rgba(13,25,54,0.4)' : 'white',
                    borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
                  }}
                >
                  <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '10px', color: '#2563eb' }}>{st.title}</h4>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>{card.title}</h4>
                  <p style={{ fontSize: '12px', color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569', lineHeight: '1.5' }}>{card.val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" style={{ padding: '80px 8%', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Frequently Asked Questions</h2>
            <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569' }}>Have questions? Here are the answers.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: 'Is my student database secure?', a: 'Yes. EduAuthority uses secure session tokens and 256-bit encryption on all operations.' },
              { q: 'Can students register themselves?', a: 'Yes. Students can easily sign up through the registration form and select their respective branch.' },
              { q: 'How does real-time sync work?', a: 'We employ WebSockets (Socket.io) to ensure announcements, notices, and chats deliver instantly without manual reloading.' },
              { q: 'Can we generate reports offline?', a: 'Our systems allow printable receipt downloads and PDF summaries for semester grades and attendances.' }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-panel" 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    padding: '20px 24px', cursor: 'pointer',
                    background: darkMode ? 'rgba(255,255,255,0.01)' : 'white',
                    borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{faq.q}</h4>
                    <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: '13px', color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569', marginTop: '12px', lineHeight: '1.6' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{
          padding: '80px 8%', background: darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Get in Touch</h2>
              <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569', marginBottom: '30px', lineHeight: '1.6' }}>
                Have inquiries about custom corporate solutions or deployment constraints? Drop us a line.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Mail size={18} color="#2563eb" /> <span>support@eduauthority.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Phone size={18} color="#2563eb" /> <span>+91 98765 43210</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <MapPin size={18} color="#2563eb" /> <span>Sector 62, Noida, India</span>
                </div>
              </div>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Your Name" className="glass-input" style={{ width: '100%' }} />
              <input type="email" placeholder="Your Email" className="glass-input" style={{ width: '100%' }} />
              <textarea placeholder="Your message..." rows={5} className="glass-input" style={{ width: '100%', resize: 'none' }} />
              <button type="button" className="btn-primary" onClick={() => alert('Message Sent successfully!')}>Send Message</button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '60px 8% 40px 8%',
          background: darkMode ? '#020715' : '#e2e8f0',
          borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '40px', marginBottom: '40px'
          }}>
            <div style={{ maxWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#2563eb', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  E
                </div>
                <span style={{ fontSize: '18px', fontWeight: '800' }}>EduAuthority</span>
              </div>
              <p style={{ fontSize: '12px', color: darkMode ? 'rgba(255,255,255,0.5)' : '#475569', lineHeight: '1.6' }}>
                Smart, fast, and cloud-ready Student Management System built for premium campus administrations.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px' }}>Quick links</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: darkMode ? 'rgba(255,255,255,0.6)' : '#475569' }}>
                  <span>About</span>
                  <span>Features</span>
                  <span>Privacy Policy</span>
                  <span>Terms & Conditions</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            maxWidth: '1200px', margin: '0 auto', paddingTop: '30px',
            borderTop: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
          }}>
            <p style={{ fontSize: '12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#475569' }}>
              © {new Date().getFullYear()} EduAuthority. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Unified Secure Sign In Page
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
              E
            </div>
            <h2 style={{ fontSize: '24px', color: 'white', fontWeight: '800', fontFamily: 'Outfit' }}>Sign In</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>Access your EduAuthority portal dashboard</p>
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
              E
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
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setRegBranch(branch);
                          setBranchFocused(false);
                        }}
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
