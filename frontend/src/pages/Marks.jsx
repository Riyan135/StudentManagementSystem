import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, PenTool, CheckCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Marks = () => {
  const { user, token, API_URL, addNotification } = useAuth();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('MCA');
  
  // Grade Form state
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('Advanced Java');
  const [examType, setExamType] = useState('Internal 1');
  const [marksObtained, setMarksObtained] = useState('');
  const [maxMarks, setMaxMarks] = useState('25');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchGrades();
    if (user.role === 'faculty' || user.role === 'admin') {
      fetchStudents();
    }
  }, [selectedBranch]);

  const fetchGrades = async () => {
    try {
      const res = await fetch(`${API_URL}/grades`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGrades(data);
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
        if (data.length > 0) {
          setStudentId(data[0].user?._id || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          subject,
          examType,
          marksObtained: Number(marksObtained),
          maxMarks: Number(maxMarks),
          remarks
        })
      });
      if (res.ok) {
        addNotification('Marks Entered', `Successfully graded student on ${subject}.`, 'success');
        setMarksObtained('');
        setRemarks('');
        fetchGrades();
      } else {
        alert('Failed to submit marks');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Setup visual charts for results
  const chartData = grades.map(g => ({
    name: `${g.subject} (${g.examType})`,
    Score: g.marksObtained,
    Max: g.maxMarks
  }));

  // 1. FACULTY / ADMIN VIEW: Grading Sheet
  if (user.role === 'faculty' || user.role === 'admin') {
    return (
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        
        {/* Grading Entry Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool size={20} style={{ color: 'var(--primary-color)' }} /> Grade Entry Sheet
          </h3>

          <form onSubmit={handleSubmitGrade} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Student Branch</label>
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
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Select Student</label>
              <select 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)}
                className="glass-input"
                required
              >
                {students.map(s => (
                  <option key={s._id} value={s.user?._id}>{s.user?.name} (Roll: {s.rollNo})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Subject</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
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
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Exam / Test Type</label>
              <select 
                value={examType} 
                onChange={(e) => setExamType(e.target.value)}
                className="glass-input"
              >
                <option value="Internal 1">Internal 1</option>
                <option value="Internal 2">Internal 2</option>
                <option value="Semester Exam">Semester Exam</option>
                <option value="Quiz">Quiz</option>
                <option value="Practical">Practical</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Marks Obtained</label>
                <input 
                  type="number" 
                  value={marksObtained}
                  onChange={(e) => setMarksObtained(e.target.value)}
                  className="glass-input" 
                  placeholder="e.g. 21"
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Max Marks</label>
                <input 
                  type="number" 
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  className="glass-input" 
                  placeholder="e.g. 25"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Remarks</label>
              <input 
                type="text" 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="glass-input" 
                placeholder="Good, needs improvement, etc."
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Publish Marks</button>
          </form>
        </div>

        {/* Grades History Logs */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Recent Published Grades</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px' }}>Student</th>
                  <th style={{ padding: '10px' }}>Subject</th>
                  <th style={{ padding: '10px' }}>Exam</th>
                  <th style={{ padding: '10px' }}>Score</th>
                  <th style={{ padding: '10px' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.slice(0, 15).map(g => (
                  <tr key={g._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{g.student?.name}</td>
                    <td style={{ padding: '12px' }}>{g.subject}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{g.examType}</td>
                    <td style={{ padding: '12px', fontWeight: '700' }}>{g.marksObtained}/{g.maxMarks}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: g.gradeLetter.includes('A') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: g.gradeLetter.includes('A') ? 'var(--success)' : 'var(--danger)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '700'
                      }}>
                        {g.gradeLetter}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  // 2. STUDENT / PARENT VIEW: Report Card & Performance chart
  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
      
      {/* Grade Ledger */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={22} style={{ color: 'var(--primary-color)' }} /> Grade Report Card
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <th style={{ padding: '12px' }}>Subject</th>
                <th style={{ padding: '12px' }}>Evaluation</th>
                <th style={{ padding: '12px' }}>Marks Obtained</th>
                <th style={{ padding: '12px' }}>Grade</th>
                <th style={{ padding: '12px' }}>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No grades available yet.</td>
                </tr>
              ) : (
                grades.map(grade => (
                  <tr key={grade._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '13px' }}>
                    <td style={{ padding: '14px', fontWeight: '700' }}>{grade.subject}</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{grade.examType}</td>
                    <td style={{ padding: '14px', fontWeight: '600' }}>{grade.marksObtained} / {grade.maxMarks}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        background: grade.gradeLetter.startsWith('A') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: grade.gradeLetter.startsWith('A') ? 'var(--success)' : 'var(--danger)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '700'
                      }}>
                        {grade.gradeLetter}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-light)' }}>{grade.remarks || 'Keep it up'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Result Analysis</h3>
          {chartData.length === 0 ? (
            <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>No metrics to generate report charts.</p>
          ) : (
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" style={{ fontSize: '10px' }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Score" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Max" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(37,99,235,0.02)' }}>
          <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>Projected CGPA Scale</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Grades are evaluated on a 10-point Scale. To view detailed evaluation policies or file grade disputes, visit the Feedback section.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Marks;
