const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./config/seed');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(() => {
  // Run Seed script to populate mock database if empty
  seedData();
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.send('MCA Student Management System API running...');
});

// Socket.io Real-time handler
const Message = require('./models/Message');
const User = require('./models/User');

// Keep track of active socket connections
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register user identification
  socket.on('register', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit('online_users', Array.from(onlineUsers.keys()));
      console.log(`Registered user ${userId} to socket ${socket.id}`);
    }
  });

  // Handle incoming private chat message
  socket.on('send_message', async ({ senderId, receiverId, content }) => {
    try {
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content
      });

      // Send to recipient if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
        io.to(receiverSocketId).emit('notification', {
          type: 'chat',
          title: 'New Message',
          message: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          senderId
        });
      }

      // Echo back to sender to confirm delivery
      socket.emit('message_sent', message);
    } catch (err) {
      console.error('Error handling send_message:', err);
    }
  });

  // Typing indicators
  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { senderId });
    }
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('stop_typing', { senderId });
    }
  });

  // Notice announcements broadcast
  socket.on('new_notice', (notice) => {
    // Broadcast notices to all connected sockets
    socket.broadcast.emit('receive_notice', notice);
    socket.broadcast.emit('notification', {
      type: 'notice',
      title: 'New Announcement',
      message: notice.title
    });
  });

  // Student registration updates or general alerts
  socket.on('admin_alert', (alert) => {
    io.emit('notification', {
      type: 'alert',
      title: 'System Alert',
      message: alert.message
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('online_users', Array.from(onlineUsers.keys()));
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
