import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Plus, CheckCircle, Clock, MessageSquare, Eye, Send } from 'lucide-react';

const Feedback = () => {
  const { user, token, API_URL, addNotification } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Resolve form state
  const [resolveResponse, setResolveResponse] = useState('');
  const [resolveStatus, setResolveStatus] = useState('Resolved');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, category, isAnonymous })
      });
      if (res.ok) {
        addNotification('Complaint Filed', 'Your complaint has been submitted successfully.', 'success');
        setShowCreateModal(false);
        setTitle(''); setDescription(''); setIsAnonymous(false);
        fetchComplaints();
      } else {
        alert('Failed to submit complaint');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/complaints/${activeComplaint._id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ response: resolveResponse, status: resolveStatus })
      });
      if (res.ok) {
        addNotification('Complaint Updated', `Status changed to "${resolveStatus}".`, 'success');
        setShowResolveModal(false);
        setResolveResponse('');
        fetchComplaints();
      } else {
        alert('Failed to update complaint');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filterStatus === 'All'
    ? complaints
    : complaints.filter(c => c.status === filterStatus);

  const statusConfig = {
    'Pending':     { bg: 'rgba(239,68,68,0.08)',   color: 'var(--danger)',  icon: <Clock size={12} /> },
    'In Progress': { bg: 'rgba(245,158,11,0.08)',   color: 'var(--warning)', icon: <MessageSquare size={12} /> },
    'Resolved':    { bg: 'rgba(16,185,129,0.08)',   color: 'var(--success)', icon: <CheckCircle size={12} /> },
  };

  const categoryColor = {
    'Academic':       '#2563eb',
    'Facilities':     '#8b5cf6',
    'Hostel':         '#f59e0b',
    'Administrative': '#10b981',
    'Others':         '#6b7280',
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Feedback & Complaints</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Submit concerns or provide feedback to the administration</p>
        </div>

        {(user.role === 'student' || user.role === 'parent') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> File Complaint
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="dashboard-grid">
        {['All', 'Pending', 'In Progress', 'Resolved'].map(status => {
          const count = status === 'All' ? complaints.length : complaints.filter(c => c.status === status).length;
          return (
            <div
              key={status}
              className="glass-panel"
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '20px 24px',
                cursor: 'pointer',
                borderBottom: filterStatus === status ? '3px solid var(--primary-color)' : '3px solid transparent',
                transition: 'var(--transition-smooth)'
              }}
            >
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {status}
              </p>
              <h3 style={{ fontSize: '28px', fontWeight: '800' }}>{count}</h3>
            </div>
          );
        })}
      </div>

      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-light)' }}>
            <AlertTriangle size={40} style={{ margin: '0 auto 16px auto', opacity: 0.3 }} />
            <p style={{ fontSize: '15px' }}>No complaints found for "{filterStatus}" status.</p>
          </div>
        ) : (
          filtered.map(complaint => {
            const cfg = statusConfig[complaint.status] || statusConfig['Pending'];
            return (
              <div key={complaint._id} className="glass-panel fade-in" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>

                  {/* Left: badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: `${categoryColor[complaint.category]}18`,
                      color: categoryColor[complaint.category],
                      padding: '4px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '700'
                    }}>
                      {complaint.category}
                    </span>
                    {complaint.isAnonymous && (
                      <span style={{ background: 'rgba(107,114,128,0.08)', color: '#6b7280', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                        Anonymous
                      </span>
                    )}
                  </div>

                  {/* Right: status + date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{
                      background: cfg.bg, color: cfg.color,
                      padding: '5px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      {cfg.icon} {complaint.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>{complaint.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{complaint.description}</p>

                {/* Filed by (Admin/Faculty view) */}
                {(user.role === 'admin' || user.role === 'faculty') && !complaint.isAnonymous && complaint.user && (
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '10px' }}>
                    Filed by: <strong>{complaint.user.name}</strong> ({complaint.user.role})
                  </p>
                )}

                {/* Admin Response */}
                {complaint.response && (
                  <div style={{
                    marginTop: '16px', padding: '14px 16px',
                    background: 'rgba(16,185,129,0.04)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: '10px'
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--success)', marginBottom: '4px' }}>
                      Administration Response:
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {complaint.response}
                    </p>
                  </div>
                )}

                {/* Action Button for Admin/Faculty */}
                {(user.role === 'admin' || user.role === 'faculty') && complaint.status !== 'Resolved' && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                    <button
                      onClick={() => {
                        setActiveComplaint(complaint);
                        setShowResolveModal(true);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: '8px',
                        border: '1px solid rgba(37,99,235,0.2)',
                        background: 'rgba(37,99,235,0.06)',
                        color: 'var(--primary-color)',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                      }}
                    >
                      <Eye size={15} /> View & Respond
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" style={{ background: 'white', padding: '36px', width: '480px', maxWidth: '90%', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>File a Complaint / Feedback</h3>
            <form onSubmit={handleSubmitComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text" placeholder="Complaint Title / Subject"
                required value={title} onChange={e => setTitle(e.target.value)}
                className="glass-input"
              />
              <textarea
                placeholder="Describe your complaint or feedback in detail..."
                required value={description} onChange={e => setDescription(e.target.value)}
                className="glass-input" rows={5} style={{ resize: 'none' }}
              />
              <select value={category} onChange={e => setCategory(e.target.value)} className="glass-input">
                <option value="Academic">Academic</option>
                <option value="Facilities">Facilities</option>
                <option value="Hostel">Hostel</option>
                <option value="Administrative">Administrative</option>
                <option value="Others">Others</option>
              </select>

              {/* Anonymous Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                <div
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    background: isAnonymous ? 'var(--primary-color)' : '#e2e8f0',
                    position: 'relative', transition: 'var(--transition-smooth)', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '3px',
                    left: isAnonymous ? '22px' : '3px',
                    width: '18px', height: '18px',
                    borderRadius: '50%', background: 'white',
                    transition: 'var(--transition-smooth)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Submit Anonymously
                </span>
              </label>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send size={16} /> Submit Complaint
                </button>
                <button
                  type="button" onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && activeComplaint && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" style={{ background: 'white', padding: '36px', width: '500px', maxWidth: '90%', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Respond to Complaint</h3>
            <p style={{ fontSize: '14px', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '20px' }}>{activeComplaint.title}</p>

            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {activeComplaint.description}
            </div>

            <form onSubmit={handleResolve} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea
                placeholder="Type your official response to the complainant..."
                required value={resolveResponse} onChange={e => setResolveResponse(e.target.value)}
                className="glass-input" rows={4} style={{ resize: 'none' }}
              />
              <select value={resolveStatus} onChange={e => setResolveStatus(e.target.value)} className="glass-input">
                <option value="In Progress">Mark as In Progress</option>
                <option value="Resolved">Mark as Resolved</option>
              </select>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Send Response</button>
                <button
                  type="button" onClick={() => setShowResolveModal(false)}
                  style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}
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
};

export default Feedback;
