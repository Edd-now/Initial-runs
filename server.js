const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const socketio = require('socket.io');
const cors = require('cors');
const therapistRoutes = require('./routes/therapistRoutes');
const journalRoutes = require('./routes/journalRoutes');
const moodRoutes = require('./routes/moods');



dotenv.config();
connectDB();

const app = express();//server creation
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/groups', require('./routes/group'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/therapists', therapistRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/moods', moodRoutes);

// Socket.io events
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    const Message = require('./models/Message');
  
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });
  
    socket.on('chatMessage', (data) => {
      io.to(data.roomId).emit('chatMessage', {
        sender: data.sender,
        text: data.text,
        timestamp: new Date(),
        roomId: data.roomId,
      });
  
      // Optional: Save to DB (check if room is group or 1-on-1)
      const Message = require('./models/Message');
      const msg = new Message({
        sender: data.senderId,
        roomId: data.roomId,
        text: data.text,
      });
      msg.save();
    });
  
    socket.on('disconnect', () => {
      console.log(` Client disconnected: ${socket.id}`);
    });
    socket.on('chatMessage', async (msg) => {
        try {
          const { sender, roomId, text, createdAt } = msg;
      
          // Log incoming payload for debugging
          console.log('Incoming message:', msg);
      
          //  Validation before save
          if (!sender || !roomId || !text) {
            return socket.emit('error', {
              msg: 'Missing one or more required fields: sender, roomId, text',
            });
          }
      
          // Save to DB
          const savedMessage = await Message.create({
            sender,
            roomId,
            text,
            createdAt: createdAt || new Date()
          });
      
          //  Emit message to all in room
          io.to(roomId).emit('chatMessage', savedMessage);
          console.log(' Message saved and broadcasted');
          
        } catch (err) {
          console.error(' Message save failed:', err);
          socket.emit('error', { msg: 'Internal server error while saving message' });
        }
      });
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room: ${roomId}`);
      });
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));