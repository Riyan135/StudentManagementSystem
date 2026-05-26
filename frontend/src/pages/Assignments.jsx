import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, Plus, ExternalLink, CheckSquare, MessageSquare } from 'lucide-react';

const Assignments = () => {
  const { user, token, API_URL, addNotification } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Selected states
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Forms
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Advanced Java');
  const [branch, setBranch] = useState('MCA');
  const [dueDate, setDueDate] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${API_URL}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, subject, branch, dueDate })
      });
      if (res.ok) {
        addNotification('New Assignment', `Assignment "${title}" posted.`, 'success');
        setShowCreateModal(false);
        // Clear
        setTitle('');
        setDescription('');
        setDueDate('');
        fetchAssignments();
      } else {
        alert('Failed to post assignment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/assignments/${activeAssignment._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: submissionContent })
      });
      if (res.ok) {
        addNotification('Assignment Submitted', 'Your submission has been received.', 'success');
        setShowSubmitModal(false);
        setSubmissionContent('');
        fetchAssignments();
      } else {
        alert('Failed to submit assignment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/assignments/${activeAssignment._id}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: selectedSubmission.student._id,
          grade: Number(gradeInput),
          feedback: feedbackInput
        })
      });
      if (res.ok) {
        addNotification('Grade Published', 'Submission graded successfully.', 'success');
        setShowGradeModal(false);
        setGradeInput('');
        setFeedbackInput('');
        fetchAssignments();
      } else {
        alert('Grading failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Academic Assignments</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Upload homework, view marks, and manage submissions</p>
        </div>

        {(user.role === 'faculty' || user.role === 'admin') && (
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> New Assignment
          </button>
        )}
      </div>

      {/* Grid of assignments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {assignments.length === 0 ? (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-light)' }}>
            No assignments listed at this time.
          </div>
        ) : (
          assignments.map(a => {
            const mySubmission = a.submissions.find(sub => sub.student?._id === user._id);
            const isSubmitted = !!mySubmission;

            return (
              <div key={a._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ 
                    background: 'rgba(37,99,235,0.06)', 
                    color: 'var(--primary-color)', 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    padding: '4px 8px', 
                    borderRadius: '4px' 
                  }}>
                    {a.subject}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Due: {new Date(a.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{a.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                    {a.description}
                  </p>
                </div>

                {/* Submissions count (Faculty) or status (Student) */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {user.role === 'student' ? (
                    <>
                      <span style={{
                        background: isSubmitted ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: isSubmitted ? 'var(--success)' : 'var(--danger)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {isSubmitted ? 'Submitted' : 'Pending'}
                      </span>

                      {isSubmitted ? (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block' }}>GRADE</span>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-color)' }}>
                            {mySubmission.grade !== undefined ? `${mySubmission.grade}/10` : 'Not Graded'}
                          </span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setActiveAssignment(a);
                            setShowSubmitModal(true);
                          }}
                          className="btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          Submit Now
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <strong>{a.submissions.length}</strong> Submissions
                      </span>
                      <button 
                        onClick={() => {
                          setActiveAssignment(a);
                          // Display submission logs drawer / section
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-color)',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        View Logs <ExternalLink size={14} />
                      </button>
                    </>
                  )}
                </div>

                {/* Submissions list shown inline if active (Faculty view) */}
                {(user.role === 'faculty' || user.role === 'admin') && activeAssignment?._id === a._id && (
                  <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '13px', marginBottom: '10px' }}>Student Submissions</h4>
                    {a.submissions.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>No submissions received yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {a.submissions.map(sub => (
                          <div key={sub._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '8px' }}>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: '600', display: 'block' }}>{sub.student?.name}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {sub.grade !== undefined ? (
                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--success)' }}>Grade: {sub.grade}/10</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedSubmission(sub);
                                    setShowGradeModal(true);
                                  }}
                                  style={{
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                  }}
                                >
                                  Grade
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" style={{ background: 'white', padding: '32px', width: '450px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Create Assignment</h3>
            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                type="text" 
                placeholder="Assignment Title" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input" 
              />
              <textarea 
                placeholder="Description" 
                required 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input" 
                rows={4}
                style={{ resize: 'none' }}
              />
              
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="glass-input">
                <option value="Advanced Java">Advanced Java</option>
                <option value="Database Systems">Database Systems</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>

              <select value={branch} onChange={(e) => setBranch(e.target.value)} className="glass-input">
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
                <option value="BTech">B.Tech</option>
              </select>

              <input 
                type="date" 
                required 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass-input" 
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Publish</button>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" style={{ background: 'white', padding: '32px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '12px' }}>Submit: {activeAssignment?.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Submit github links, online document drive links, or write up the code files directly below.</p>
            
            <form onSubmit={handleSubmitAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea 
                placeholder="Paste code or submission links..." 
                required 
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                className="glass-input" 
                rows={6}
                style={{ resize: 'none' }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit</button>
                <button type="button" onClick={() => setShowSubmitModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {showGradeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" style={{ background: 'white', padding: '32px', width: '400px', maxWidth: '90%' }}>
            <h3>Grade Ward: {selectedSubmission?.student?.name}</h3>
            
            <form onSubmit={handleGradeSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <strong>Student Content:</strong> {selectedSubmission?.content}
              </div>

              <input 
                type="number" 
                placeholder="Grade Score (Out of 10)" 
                max="10" 
                min="0"
                required 
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="glass-input" 
              />

              <input 
                type="text" 
                placeholder="Teacher Feedback" 
                required 
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="glass-input" 
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Grade</button>
                <button type="button" onClick={() => setShowGradeModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Assignments;
