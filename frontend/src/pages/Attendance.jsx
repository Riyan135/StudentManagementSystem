import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, X, Clock, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Attendance = () => {
  const { user, token, API_URL, addNotification } = { ...useAuth() };
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('MCA');
  const [selectedSubject, setSelectedSubject] = useState('Advanced Java');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState({}); // studentId -> status

  useEffect(() => {
    fetchLogs();
    if (user.role === 'faculty' || user.role === 'admin') {
      fetchStudents();
    }
  }, [selectedBranch]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/students?branch=${selectedBranch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        // Initialize attendance values
        const initial = {};
        data.forEach(s => {
          initial[s.user?._id] = 'Present';
        });
        setAttendanceState(initial);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    const studentsPayload = Object.keys(attendanceState).map(id => ({
      studentId: id,
      status: attendanceState[id]
    }));

    try {
      const res = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          students: studentsPayload,
          subject: selectedSubject,
          date: attendanceDate
        })
      });
      if (res.ok) {
        addNotification('Attendance Recorded', `Attendance for ${selectedSubject} saved successfully.`, 'success');
        fetchLogs();
      } else {
        alert('Failed to mark attendance');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper calculations for Students
  const getSubjectAttendancePercent = () => {
    const counts = {};
    logs.forEach(log => {
      if (!counts[log.subject]) {
        counts[log.subject] = { present: 0, total: 0 };
      }
      counts[log.subject].total += 1;
      if (log.status === 'Present' || log.status === 'Late') {
        counts[log.subject].present += 1;
      }
    });

    return Object.keys(counts).map(sub => ({
      name: sub,
      percentage: Math.round((counts[sub].present / counts[sub].total) * 100)
    }));
  };

  const percentData = getSubjectAttendancePercent();

  // 1. FACULTY / ADMIN ATTENDANCE MARKING PANEL
  if (user.role === 'faculty' || user.role === 'admin') {
    return (
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Marking Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Mark Daily Attendance</h3>
          
          <form onSubmit={handleSaveAttendance} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Academic Branch</label>
                <select 
                  value={selectedBranch} 
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="glass-input"
                >
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="BTech">B.Tech</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Lecture Subject</label>
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="glass-input"
                >
                  {selectedBranch === 'MCA' ? (
                    <>
                      <option value="Advanced Java">Advanced Java</option>
                      <option value="Database Systems">Database Systems</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                    </>
                  ) : (
                    <>
                      <option value="Business Management">Business Management</option>
                      <option value="Marketing Research">Marketing Research</option>
                      <option value="Corporate Finance">Corporate Finance</option>
                    </>
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Lecture Date</label>
                <input 
                  type="date" 
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="glass-input" 
                />
              </div>
            </div>

            {/* List of Students */}
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-secondary)' }}>Students List</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                {students.length === 0 ? (
                  <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>No students found in this branch.</p>
                ) : (
                  students.map(student => (
                    <div 
                      key={student._id} 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'rgba(0,0,0,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.02)'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '600', fontSize: '14px', display: 'block' }}>{student.user?.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Roll: {student.rollNo}</span>
                      </div>

                      {/* Status selectors */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['Present', 'Absent', 'Late'].map(status => {
                          const isSel = attendanceState[student.user?._id] === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleStatusChange(student.user?._id, status)}
                              style={{
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'var(--transition-smooth)',
                                background: isSel ? (
                                  status === 'Present' ? 'var(--success)' : 
                                  status === 'Absent' ? 'var(--danger)' : 'var(--warning)'
                                ) : 'rgba(0,0,0,0.04)',
                                color: isSel ? 'white' : 'var(--text-secondary)'
                              }}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '10px' }}
              disabled={students.length === 0}
            >
              Submit Attendance
            </button>
          </form>
        </div>

        {/* View Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Recent Attendance Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '580px', overflowY: 'auto' }}>
            {logs.slice(0, 15).map(log => (
              <div 
                key={log._id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700' }}>{log.student?.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                    {log.subject} • {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>

                <span style={{
                  background: log.status === 'Present' ? 'rgba(16,185,129,0.1)' : log.status === 'Absent' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                  color: log.status === 'Present' ? 'var(--success)' : log.status === 'Absent' ? 'var(--danger)' : 'var(--warning)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // 2. STUDENT / PARENT VIEW
  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
      
      {/* Attendance Stats Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Total Overall Stats */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Overall Attendance Rate</h4>
          <h2 style={{ fontSize: '48px', fontWeight: '800', color: 'var(--success)' }}>
            {logs.length > 0 
              ? Math.round((logs.filter(l => l.status === 'Present' || l.status === 'Late').length / logs.length) * 100) 
              : 0}%
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '12px', marginTop: '6px' }}>
            Classes: {logs.filter(l => l.status === 'Present' || l.status === 'Late').length} / {logs.length}
          </p>
        </div>

        {/* Recharts subject stats */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Subject-wise Statistics</h3>
          {percentData.length === 0 ? (
            <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>No statistical logs to display.</p>
          ) : (
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={percentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '11px' }} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="var(--success)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Detailed logs table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Full Attendance Ledger</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Subject</th>
                <th style={{ padding: '12px' }}>Marked By</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No logs reported.</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '13px' }}>
                    <td style={{ padding: '14px', fontWeight: '500' }}>{new Date(log.date).toLocaleDateString()}</td>
                    <td style={{ padding: '14px', fontWeight: '600' }}>{log.subject}</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{log.markedBy?.name}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        background: log.status === 'Present' ? 'rgba(16,185,129,0.1)' : log.status === 'Absent' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: log.status === 'Present' ? 'var(--success)' : log.status === 'Absent' ? 'var(--danger)' : 'var(--warning)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        fontSize: '11px'
                      }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Attendance;
