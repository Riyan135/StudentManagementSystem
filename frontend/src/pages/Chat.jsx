import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, Smile, Info } from 'lucide-react';

const Chat = () => {
  const { user, token, API_URL } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Load Contacts list
  useEffect(() => {
    fetchContacts();
  }, []);

  // Listen to Socket events for active chat
  useEffect(() => {
    if (!socket || !selectedContact) return;

    socket.on('receive_message', (msg) => {
      if (msg.sender === selectedContact._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('message_sent', (msg) => {
      if (msg.receiver === selectedContact._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('typing', (data) => {
      if (data.senderId === selectedContact._id) {
        setPeerTyping(true);
      }
    });

    socket.on('stop_typing', (data) => {
      if (data.senderId === selectedContact._id) {
        setPeerTyping(false);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, [socket, selectedContact]);

  useEffect(() => {
    if (selectedContact) {
      fetchChatHistory();
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, peerTyping]);

  const fetchContacts = async () => {
    try {
      // Students see faculty; Faculty see students; Parents see faculty
      let roleFilter = '';
      if (user.role === 'student' || user.role === 'parent') {
        roleFilter = '?role=faculty';
      } else if (user.role === 'faculty') {
        roleFilter = '?role=student';
      }

      const res = await fetch(`${API_URL}/users${roleFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
        if (data.length > 0) {
          setSelectedContact(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/history/${selectedContact._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket) return;

    socket.emit('send_message', {
      senderId: user._id,
      receiverId: selectedContact._id,
      content: messageText
    });

    socket.emit('stop_typing', {
      senderId: user._id,
      receiverId: selectedContact._id
    });

    setMessageText('');
    setIsTyping(false);
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (!socket || !selectedContact) return;

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      socket.emit('typing', { senderId: user._id, receiverId: selectedContact._id });
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      socket.emit('stop_typing', { senderId: user._id, receiverId: selectedContact._id });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="glass-panel fade-in" style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      height: 'calc(100vh - 180px)',
      minHeight: '480px',
      overflow: 'hidden'
    }}>
      
      {/* Contact sidebar list */}
      <div style={{ borderRight: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.01)' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Directory Chat</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Select a user to chat in real-time</span>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px' }}>
          {contacts.map(c => {
            const isOnline = onlineUsers.includes(c._id);
            const isSel = selectedContact?._id === c._id;
            return (
              <button
                key={c._id}
                onClick={() => {
                  setSelectedContact(c);
                  setPeerTyping(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)',
                  background: isSel ? 'var(--primary-gradient)' : 'transparent',
                  color: isSel ? 'white' : 'var(--text-primary)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
                    alt={c.name} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {isOnline && (
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--success)',
                      border: '2px solid white'
                    }}></span>
                  )}
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {c.name}
                  </h4>
                  <span style={{ fontSize: '10px', color: isSel ? 'rgba(255,255,255,0.8)' : 'var(--text-light)', textTransform: 'capitalize' }}>
                    {c.role} {isOnline && '• Online'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary chat workspace */}
      {selectedContact ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={selectedContact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
                alt={selectedContact.name} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{selectedContact.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                  {peerTyping ? 'Typing...' : (onlineUsers.includes(selectedContact._id) ? 'Online' : 'Offline')}
                </span>
              </div>
            </div>
            
            <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
              <Info size={20} />
            </button>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.005)' }}>
            {messages.map((msg) => {
              const isMyMessage = msg.sender === user._id;
              return (
                <div 
                  key={msg._id} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    alignSelf: isMyMessage ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: isMyMessage ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
                    background: isMyMessage ? 'var(--primary-gradient)' : 'white',
                    color: isMyMessage ? 'white' : 'var(--text-primary)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    border: isMyMessage ? 'none' : '1px solid rgba(0,0,0,0.04)',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '4px', padding: '0 4px' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {/* Peer typing indicator */}
            {peerTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.04)', padding: '10px 16px', borderRadius: '12px 12px 12px 0px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span className="pulse" style={{ display: 'inline-block' }}>Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Form box */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}
          >
            <input 
              type="text" 
              placeholder="Write an instant message..." 
              value={messageText}
              onChange={handleTyping}
              className="glass-input"
              style={{ flex: 1, padding: '14px 18px', borderRadius: '24px' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '14px' }}>
          Select a contact to begin messaging.
        </div>
      )}
    </div>
  );
};

export default Chat;
