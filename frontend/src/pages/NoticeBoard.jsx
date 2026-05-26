import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Megaphone, Plus, Tag, Calendar, User } from 'lucide-react';

const NoticeBoard = () => {
  const { user, token, API_URL, addNotification } = useAuth();
  const { socket } = useSocket();
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New notice forms
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');

  useEffect(() => {
    fetchNotices();
  }, []);

  // Listen for live announcements from peer sockets
  useEffect(() => {
    if (!socket) return;
    socket.on('receive_notice', (notice) => {
      setNotices((prev) => [notice, ...prev]);
    });
    return () => {
      socket.off('receive_notice');
    };
  }, [socket]);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, category })
      });
      const data = await res.json();
      if (res.ok) {
        // Emit socket notification to all users
        if (socket) {
          socket.emit('new_notice', {
            ...data,
            createdBy: { name: user.name, role: user.role }
          });
        }
        addNotification('Notice Posted', `Announcement "${title}" is now active.`, 'success');
        setShowCreateModal(false);
        setTitle('');
        setContent('');
        fetchNotices();
      } else {
        alert('Failed to post announcement');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotices = filter === 'All' 
    ? notices 
    : notices.filter(n => n.category === filter);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>College Notice Board</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Live updates and announcements from the administration</p>
        </div>

        {(user.role === 'admin' || user.role === 'faculty') && (
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Add Announcement
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'General', 'Academic', 'Urgent', 'Event', 'Placement'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: filter === cat ? 'none' : '1px solid rgba(0,0,0,0.1)',
              background: filter === cat ? 'var(--primary-gradient)' : 'white',
              color: filter === cat ? 'white' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredNotices.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
            No notices found for category "{filter}".
          </div>
        ) : (
          filteredNotices.map((n) => (
            <div key={n._id} className="glass-panel fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{
                  background: 
                    n.category === 'Urgent' ? 'rgba(239,68,68,0.1)' : 
                    n.category === 'Academic' ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.1)',
                  color: 
                    n.category === 'Urgent' ? 'var(--danger)' : 
                    n.category === 'Academic' ? 'var(--primary-color)' : 'var(--success)',
                  fontWeight: '700',
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase'
                }}>
                  {n.category}
                </span>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-light)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} /> By: {n.createdBy?.name} ({n.createdBy?.role})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {new Date(n.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{n.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
                  {n.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContext: 'center',
          justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" style={{ background: 'white', padding: '32px', width: '450px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Post Announcement</h3>
            <form onSubmit={handlePostNotice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                type="text" 
                placeholder="Announcement Title" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input" 
              />
              <textarea 
                placeholder="Type notice message contents..." 
                required 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="glass-input" 
                rows={5}
                style={{ resize: 'none' }}
              />

              <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass-input">
                <option value="General">General</option>
                <option value="Academic">Academic</option>
                <option value="Urgent">Urgent</option>
                <option value="Event">Event</option>
                <option value="Placement">Placement</option>
              </select>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Post Notice</button>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default NoticeBoard;
