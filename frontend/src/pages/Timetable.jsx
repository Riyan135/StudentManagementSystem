import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, BookOpen, User } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const { user, token, API_URL } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || 'Monday');
  const [selectedBranch, setSelectedBranch] = useState('MCA');

  useEffect(() => {
    fetchTimetable();
  }, [selectedBranch]);

  const fetchTimetable = async () => {
    try {
      const res = await fetch(`${API_URL}/timetable?branch=${selectedBranch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTimetable(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const daySchedule = timetable.find(t => t.day === selectedDay);

  // Get today's info for a "today" marker
  const todayDay = DAYS[new Date().getDay() - 1];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Class Timetable</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Weekly lecture schedule and class room details</p>
        </div>

        {(user.role === 'admin') && (
          <select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            className="glass-input"
            style={{ padding: '10px 16px' }}
          >
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BTech">B.Tech</option>
          </select>
        )}
      </div>

      {/* Day Picker Row */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '13px',
              transition: 'var(--transition-smooth)',
              background: selectedDay === day
                ? 'var(--primary-gradient)'
                : day === todayDay
                  ? 'rgba(37,99,235,0.08)'
                  : 'white',
              color: selectedDay === day ? 'white' : day === todayDay ? 'var(--primary-color)' : 'var(--text-secondary)',
              boxShadow: selectedDay === day ? '0 4px 12px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
              position: 'relative'
            }}
          >
            {day}
            {day === todayDay && selectedDay !== day && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--primary-color)',
                border: '2px solid white'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Main Schedule Grid */}
      {!daySchedule || daySchedule.periods.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-light)' }}>
          <Calendar size={40} style={{ margin: '0 auto 16px auto', opacity: 0.3 }} />
          <p style={{ fontSize: '15px' }}>No classes scheduled for {selectedDay}.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {daySchedule.periods.map((period, index) => (
            <div
              key={index}
              className="glass-panel fade-in"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '120px 1fr 1fr 1fr',
                alignItems: 'center',
                gap: '24px',
                borderLeft: `4px solid hsl(${index * 40 + 200}, 75%, 55%)`
              }}
            >
              {/* Time */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: `hsla(${index * 40 + 200}, 75%, 55%, 0.08)`,
                  color: `hsl(${index * 40 + 200}, 60%, 45%)`,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  <Clock size={14} style={{ marginBottom: '4px', display: 'block', margin: '0 auto 4px auto' }} />
                  {period.time.split(' - ')[0]}
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px' }}>
                  to {period.time.split(' - ')[1]}
                </p>
              </div>

              {/* Subject */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(37,99,235,0.06)', borderRadius: '10px', color: 'var(--primary-color)' }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{period.subject}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Period {index + 1}</span>
                </div>
              </div>

              {/* Faculty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: 'rgba(16,185,129,0.06)', borderRadius: '8px', color: 'var(--success)' }}>
                  <User size={16} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {period.facultyName}
                </span>
              </div>

              {/* Room */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                <div style={{ padding: '8px', background: 'rgba(245,158,11,0.06)', borderRadius: '8px', color: 'var(--warning)' }}>
                  <MapPin size={16} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {period.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly Summary Grid */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Full Week at a Glance</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', width: '120px' }}>Time</th>
                {DAYS.map(day => (
                  <th
                    key={day}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'center',
                      color: day === selectedDay ? 'var(--primary-color)' : 'var(--text-secondary)',
                      fontWeight: day === selectedDay ? '800' : '600'
                    }}
                  >
                    {day.slice(0, 3)}
                    {day === todayDay && <span style={{ display: 'block', fontSize: '10px', color: 'var(--primary-color)' }}>Today</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['09:00 AM', '11:00 AM', '01:30 PM', '03:15 PM'].map((timeSlot, tIdx) => (
                <tr key={timeSlot} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{timeSlot}</td>
                  {DAYS.map(day => {
                    const dayData = timetable.find(t => t.day === day);
                    const period = dayData?.periods[tIdx];
                    return (
                      <td
                        key={day}
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          background: day === selectedDay ? 'rgba(37,99,235,0.03)' : 'transparent'
                        }}
                      >
                        {period ? (
                          <div>
                            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{period.subject}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>{period.room}</p>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-light)', fontSize: '11px' }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Timetable;
