import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  AlertCircle, 
  Megaphone, 
  Plus, 
  Search, 
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { user, token, API_URL, addNotification } = useAuth();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [showRegModal, setShowRegModal] = useState(false);

  // Form states for new registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');
  const [regBranch, setRegBranch] = useState('MCA');
  const [regRollNo, setRegRollNo] = useState('');
  const [regParentEmail, setRegParentEmail] = useState('');

  // Fetch Dashboard Stats & Notices
  useEffect(() => {
    if (user.role === 'admin') {
      fetchAdminStats();
      fetchStudentsList();
    }
    fetchNotices();
  }, [user.role, selectedBranch]);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentsList = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/students?branch=${selectedBranch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotices(data.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
          branch: regRole === 'student' ? regBranch : undefined,
          rollNo: regRole === 'student' ? regRollNo : undefined,
          parentEmail: regRole === 'student' ? regParentEmail : undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        addNotification('Registration Success', `${regName} registered as ${regRole}`, 'success');
        setShowRegModal(false);
        // Clear fields
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegRollNo('');
        setRegParentEmail('');
        // Refresh list
        if (user.role === 'admin') {
          fetchAdminStats();
          fetchStudentsList();
        }
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter students by search
  const filteredStudents = students.filter(s => 
    s.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart data setup for admin branch distribution
  const branchData = [
    { name: 'MCA', students: students.filter(s => s.branch === 'MCA').length },
    { name: 'MBA', students: students.filter(s => s.branch === 'MBA').length },
    { name: 'B.Tech', students: students.filter(s => s.branch === 'BTech').length || 0 }
  ];

  const pieColors = ['#2563eb', '#10b981', '#f59e0b', '#3b82f6'];

  // 1. ADMIN DASHBOARD VIEW
  if (user.role === 'admin') {
    return (
      <div className="fade-in">
        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(37,99,235,0.08)', borderRadius: '12px', color: 'var(--primary-color)' }}>
              <Users size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.studentCount || 0}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Students</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', color: 'var(--success)' }}>
              <GraduationCap size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.facultyCount || 0}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Faculty</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(245,158,11,0.08)', borderRadius: '12px', color: 'var(--warning)' }}>
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.complaintsPending || 0}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Pending Complaints</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(37,99,235,0.08)', borderRadius: '12px', color: 'var(--primary-color)' }}>
              <CreditCard size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '800' }}>₹{stats?.totalFeesCollected?.toLocaleString() || 0}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Fees Collected</p>
            </div>
          </div>
        </div>

        {/* Charts & Actions */}
        <div className="chart-grid">
          {/* Bar Chart branch metrics */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Student Strength by Branch</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Bar dataKey="students" fill="var(--primary-color)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px' }}>Administrative Actions</h3>
            <button 
              onClick={() => setShowRegModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: '12px',
                background: 'var(--primary-gradient)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37,99,235,0.15)'
              }}
            >
              <Plus size={20} /> Register User
            </button>
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Recent Notices</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notices.map(n => (
                  <div key={n._id} style={{ background: 'rgba(15,23,42,0.02)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: '700' }}>{n.title}</h5>
                    <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>{new Date(n.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Student List according to Branch */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px' }}>Student Directory</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Manage records grouped by academics</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Branch Selector */}
              <select 
                value={selectedBranch} 
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  outline: 'none',
                  fontSize: '14px'
                }}
              >
                <option value="All">All Branches</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
                <option value="BTech">B.Tech</option>
              </select>

              {/* Search input */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search student or roll..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 16px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    outline: 'none',
                    fontSize: '14px',
                    width: '220px'
                  }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-light)' }} />
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <th style={{ padding: '12px 16px' }}>Student Name</th>
                  <th style={{ padding: '12px 16px' }}>Roll Number</th>
                  <th style={{ padding: '12px 16px' }}>Branch</th>
                  <th style={{ padding: '12px 16px' }}>Batch</th>
                  <th style={{ padding: '12px 16px' }}>CGPA</th>
                  <th style={{ padding: '12px 16px' }}>Parent Email</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No students found.</td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '14px' }}>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={student.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
                          alt="avatar" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ fontWeight: '600' }}>{student.user?.name}</p>
                          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{student.user?.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>{student.rollNo}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ background: 'rgba(37,99,235,0.06)', color: 'var(--primary-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                          {student.branch}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{student.batch}</td>
                      <td style={{ padding: '16px', fontWeight: '700' }}>{student.cgpa.toFixed(2)}</td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{student.parentEmail || 'N/A'}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: student.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: student.status === 'Active' ? 'var(--success)' : 'var(--danger)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Registration Modal */}
        {showRegModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div className="glass-panel fade-in" style={{ background: 'white', padding: '32px', width: '450px', maxWidth: '90%', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Register New User</h3>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="glass-input" 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="glass-input" 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="glass-input" 
                />
                
                <select 
                  value={regRole} 
                  onChange={(e) => setRegRole(e.target.value)}
                  className="glass-input"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>

                {regRole === 'student' && (
                  <>
                    <input 
                      type="text" 
                      placeholder="Roll Number" 
                      required
                      value={regRollNo}
                      onChange={(e) => setRegRollNo(e.target.value)}
                      className="glass-input" 
                    />
                    <select 
                      value={regBranch} 
                      onChange={(e) => setRegBranch(e.target.value)}
                      className="glass-input"
                    >
                      <option value="MCA">MCA</option>
                      <option value="MBA">MBA</option>
                      <option value="BTech">B.Tech</option>
                    </select>
                    <input 
                      type="email" 
                      placeholder="Parent's Email" 
                      required
                      value={regParentEmail}
                      onChange={(e) => setRegParentEmail(e.target.value)}
                      className="glass-input" 
                    />
                  </>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Register</button>
                  <button 
                    type="button" 
                    onClick={() => setShowRegModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. FACULTY, STUDENT, OR PARENT DASHBOARD VIEW
  return (
    <div className="fade-in">
      <div className="dashboard-grid">
        {/* General welcome card */}
        <div className="glass-panel" style={{
          padding: '32px',
          background: 'var(--primary-gradient)',
          color: 'white',
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome, {user.name}!</h2>
            <p style={{ opacity: 0.9, fontSize: '15px' }}>
              {user.role === 'student' && 'Keep track of your academic metrics, daily attendance, class lectures, and submissions.'}
              {user.role === 'faculty' && 'Manage your student classes, track daily subject attendances, check files, and post notices.'}
              {user.role === 'parent' && "Stay updated with your ward's class schedules, grades, attendance progress, and due fees."}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '12px 24px',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            fontWeight: '600'
          }}>
            Role: <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        {/* Left Side: Role Specific Metrics & Notice Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {user.role === 'student' && (
              <>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Academic CGPA</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-color)' }}>8.75</h3>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Average Attendance</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>88%</h3>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Pending Assignments</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--warning)' }}>2</h3>
                </div>
              </>
            )}
            
            {user.role === 'parent' && (
              <>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Ward's CGPA</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-color)' }}>8.75</h3>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Ward's Attendance</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>88%</h3>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Outstanding Fees</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--danger)' }}>₹65,000</h3>
                </div>
              </>
            )}

            {user.role === 'faculty' && (
              <>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Assigned Classes</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-color)' }}>4</h3>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Active Assignments</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>3</h3>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Pending Gradings</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--warning)' }}>5</h3>
                </div>
              </>
            )}
          </div>

          {/* Graphical Analytics (Mocked Chart for attendance breakdown) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Attendance Performance Breakdown</h3>
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { subject: 'Advanced Java', attendance: 92 },
                  { subject: 'Database Systems', attendance: 85 },
                  { subject: 'Software Eng', attendance: 95 },
                  { subject: 'Machine Learning', attendance: 78 },
                  { subject: 'Cloud Computing', attendance: 90 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Announcements / Timetable shortcut */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Notices */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Megaphone size={20} style={{ color: 'var(--primary-color)' }} />
              <h3 style={{ fontSize: '18px' }}>Announcements</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {notices.map(n => (
                <div key={n._id} style={{ paddingBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      background: n.category === 'Urgent' ? 'rgba(239,68,68,0.1)' : 'rgba(37,99,235,0.1)',
                      color: n.category === 'Urgent' ? 'var(--danger)' : 'var(--primary-color)',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontWeight: '700'
                    }}>
                      {n.category}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>{new Date(n.date).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize: '14px', marginTop: '6px', fontWeight: '700' }}>{n.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Class Timetable Shortcut */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar size={20} style={{ color: 'var(--primary-color)' }} />
              <h3 style={{ fontSize: '18px' }}>Today's Classes</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '700' }}>Advanced Java</h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Prof. Anjali Mehta • Room Lab 3</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-color)' }}>09:00 AM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '700' }}>Database Systems</h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Dr. Suresh Kumar • Room LH A</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-color)' }}>11:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
