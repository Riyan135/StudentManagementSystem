import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Award, BookOpen, UserCheck, Shield } from 'lucide-react';

const Profile = () => {
  const { user, token, API_URL, addNotification } = useAuth();
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || null);
        if (data.profile) {
          setPhone(data.profile.phone || '');
          setAddress(data.profile.address || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/profiles/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ phone, address })
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setIsEditing(false);
        addNotification('Profile Updated', 'Your profile details have been saved.', 'success');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Profile Header Banner */}
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '32px',
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '5%',
          top: '-20%',
          opacity: 0.05,
          color: 'var(--primary-color)'
        }}>
          <User size={180} />
        </div>

        <img 
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
          alt={user.name} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{user.email}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span style={{ 
              background: 'rgba(37,99,235,0.08)', 
              color: 'var(--primary-color)', 
              fontWeight: '600', 
              fontSize: '12px', 
              padding: '4px 12px', 
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>
              {user.role}
            </span>
            {profile && (
              <span style={{ 
                background: 'rgba(16,185,129,0.08)', 
                color: 'var(--success)', 
                fontWeight: '600', 
                fontSize: '12px', 
                padding: '4px 12px', 
                borderRadius: '20px'
              }}>
                {profile.branch} - Batch {profile.batch}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        
        {/* Left Column: Quick academic status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {profile && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: 'var(--primary-color)' }} /> Academic Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Roll Number</span>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{profile.rollNo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Current CGPA</span>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--primary-color)' }}>{profile.cgpa.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Department</span>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{profile.branch}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Parent Email</span>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>{profile.parentEmail}</span>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} style={{ color: 'var(--primary-color)' }} /> Account Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <p style={{ color: 'var(--text-secondary)' }}><strong>ID:</strong> {user._id}</p>
              <p style={{ color: 'var(--text-secondary)' }}><strong>Registered:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Details Edit */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px' }}>Contact Details</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(37,99,235,0.08)',
                  color: 'var(--primary-color)',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                Edit Details
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  <Phone size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Phone Number
                </label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="glass-input" 
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Contact Address
                </label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="glass-input" 
                  placeholder="Enter full postal address..."
                  rows={4}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '12px 20px',
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
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: 'rgba(37,99,235,0.06)', borderRadius: '8px', color: 'var(--primary-color)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block' }}>PHONE NUMBER</span>
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>{phone || 'Not provided'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: 'rgba(37,99,235,0.06)', borderRadius: '8px', color: 'var(--primary-color)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block' }}>CONTACT ADDRESS</span>
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>{address || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Profile;
