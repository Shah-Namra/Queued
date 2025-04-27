const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const Song = require('../models/song');
const Room = require('../models/room');

/**
 * WebSocket service for real-time communication
 */
class SocketService {
  constructor(io) {
    this.io = io;
    this.initialize();
  }

  /**
   * Initialize WebSocket server with middleware and event handlers
   */
  initialize() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { rows } = await pool.query(
          'SELECT id, username FROM users WHERE id = $1',
          [decoded.userId]
        );

        if (rows.length === 0) {
          return next(new Error('User not found'));
        }

        socket.user = rows[0];
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id} (User: ${socket.user.username})`);

      // Join room handler
      socket.on('join-room', async (roomCode) => {
        try {
          const room = await Room.findByCode(roomCode);
          if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
          }

          // Verify user is a participant
          const { rows } = await pool.query(
            'SELECT role FROM participants WHERE room_id = $1 AND user_id = $2',
            [room.id, socket.user.id]
          );

          if (rows.length === 0) {
            socket.emit('error', { message: 'Not a room participant' });
            return;
          }

          socket.join(roomCode);
          socket.roomCode = roomCode;
          socket.role = rows[0].role;

          // Emit initial room state
          const roomDetails = await Room.getDetails(room.id);
          socket.emit('room-state', roomDetails);

          // Notify others of new participant
          socket.to(roomCode).emit('participant-joined', {
            userId: socket.user.id,
            username: socket.user.username,
            role: socket.role
          });
        } catch (error) {
          socket.emit('error', { message: 'Failed to join room' });
          console.error('Join room error:', error);
        }
      });

      // Song addition handler
      socket.on('add-song', async (songData) => {
        try {
          if (!socket.roomCode) {
            socket.emit('error', { message: 'Not in a room' });
            return;
          }

          const room = await Room.findByCode(socket.roomCode);
          if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
          }

          const song = await Song.add({
            ...songData,
            roomId: room.id,
            addedBy: socket.user.id
          });

          // Broadcast to all room participants
          this.io.to(socket.roomCode).emit('song-added', song);
        } catch (error) {
          socket.emit('error', { message: 'Failed to add song' });
          console.error('Add song error:', error);
        }
      });

      // Song removal handler
      socket.on('remove-song', async (songId) => {
        try {
          if (!socket.roomCode || socket.role !== 'host') {
            socket.emit('error', { message: 'Unauthorized' });
            return;
          }

          await Song.remove(songId);
          this.io.to(socket.roomCode).emit('song-removed', { songId });
        } catch (error) {
          socket.emit('error', { message: 'Failed to remove song' });
          console.error('Remove song error:', error);
        }
      });

      // Vote handler
      socket.on('vote', async ({ songId, voteType }) => {
        try {
          if (!socket.roomCode) {
            socket.emit('error', { message: 'Not in a room' });
            return;
          }

          const song = await Song.vote(songId, socket.user.id, voteType);
          this.io.to(socket.roomCode).emit('vote-updated', song);
        } catch (error) {
          socket.emit('error', { message: 'Failed to process vote' });
          console.error('Vote error:', error);
        }
      });

      // Queue reorder handler
      socket.on('reorder-queue', async ({ newOrder }) => {
        try {
          if (!socket.roomCode || socket.role !== 'host') {
            socket.emit('error', { message: 'Unauthorized' });
            return;
          }

          const room = await Room.findByCode(socket.roomCode);
          await Song.reorder(room.id, newOrder);
          this.io.to(socket.roomCode).emit('queue-reordered', { newOrder });
        } catch (error) {
          socket.emit('error', { message: 'Failed to reorder queue' });
          console.error('Reorder queue error:', error);
        }
      });

      // Disconnection handler
      socket.on('disconnect', async () => {
        if (socket.roomCode) {
          try {
            const room = await Room.findByCode(socket.roomCode);
            await Room.leave(room.id, socket.user.id);
            
            // Notify others of participant leaving
            socket.to(socket.roomCode).emit('participant-left', {
              userId: socket.user.id,
              username: socket.user.username
            });
          } catch (error) {
            console.error('Leave room error:', error);
          }
        }
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}

module.exports = SocketService;
