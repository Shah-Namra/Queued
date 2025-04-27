/**
 * Socket Event Handlers
 * 
 * Sets up all socket event handlers
 */
import socketAuthMiddleware from './auth';
import { handleJoinRoom, handleLeaveRoom } from './roomHandlers';
import { handleSendMessage } from './chatHandlers';
import { 
  handleSongAdded, 
  handleSongRemoved, 
  handleSongVoted, 
  handleCurrentSongChanged, 
  handlePlaybackProgress
} from './queueHandlers';
import { removeSocketFromAllRooms } from'./utils';

/**
 * Set up Socket.io event handlers
 * @param {Object} io - Socket.io server instance
 */
const setupSocketHandlers = (io) => {
  // JWT authentication middleware for socket connections
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Join a room
    socket.on('join_room', (data) => handleJoinRoom(io, socket, data));
    
    // Leave a room
    socket.on('leave_room', (data) => handleLeaveRoom(io, socket, data));
    
    // Send a chat message
    socket.on('send_message', (data) => handleSendMessage(io, socket, data));
    
    // Song added to queue
    socket.on('song_added', (data) => handleSongAdded(io, socket, data));
    
    // Song removed from queue
    socket.on('song_removed', (data) => handleSongRemoved(io, socket, data));
    
    // Song vote changed
    socket.on('song_voted', (data) => handleSongVoted(io, socket, data));
    
    // Current song changed
    socket.on('current_song_changed', (data) => handleCurrentSongChanged(io, socket, data));
    
    // Playback progress update
    socket.on('playback_progress', (data) => handlePlaybackProgress(io, socket, data));
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Remove user from all room connections
      const removedConnections = removeSocketFromAllRooms(socket.id);
      
      // Notify rooms about user disconnection
      for (const [roomId, userId] of removedConnections) {
        socket.to(roomId).emit('user_disconnected', {
          userId,
          timestamp: new Date()
        });
        
        console.log(`User ${userId} disconnected from room ${roomId}`);
      }
    });
  });
};

module.exports = { setupSocketHandlers };
