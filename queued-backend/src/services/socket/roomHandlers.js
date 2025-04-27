
/**
 * Room Event Handlers
 * 
 * Handlers for room-related socket events
 */
import db from '../../config/database';
import { addUserToRoom, removeUserFromRoom }from './utils';

/**
 * Handle room join event
 * @param {Object} io - Socket.io server instance
 * @param {Object} socket - Socket instance
 * @param {Object} data - Event data
 */
const handleJoinRoom = async (io, socket, { roomId }) => {
  try {
    const userId = socket.user.id;
    
    // Check if room exists
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1 AND is_active = true',
      [roomId]
    );
    
    if (roomResult.rows.length === 0) {
      socket.emit('error', { message: 'Room not found or inactive' });
      return;
    }
    
    // Add socket to room
    socket.join(roomId);
    
    // Add to room connections map
    addUserToRoom(roomId, userId, socket.id);
    
    // Get user info
    const userResult = await db.query(
      'SELECT id, username, avatar_url FROM users WHERE id = $1',
      [userId]
    );
    
    const user = userResult.rows[0];
    
    // Notify room about new user
    socket.to(roomId).emit('user_joined', {
      user,
      timestamp: new Date()
    });
    
    console.log(`User ${userId} joined room ${roomId}`);
  } catch (error) {
    console.error('Error joining room:', error);
    socket.emit('error', { message: 'Failed to join room' });
  }
};

/**
 * Handle room leave event
 * @param {Object} io - Socket.io server instance
 * @param {Object} socket - Socket instance
 * @param {Object} data - Event data
 */
const handleLeaveRoom = async (io, socket, { roomId }) => {
  try {
    const userId = socket.user.id;
    
    // Remove socket from room
    socket.leave(roomId);
    
    // Remove from room connections map
    removeUserFromRoom(roomId, userId);
    
    // Get user info
    const userResult = await db.query(
      'SELECT id, username FROM users WHERE id = $1',
      [userId]
    );
    
    const username = userResult.rows[0]?.username || 'Unknown user';
    
    // Notify room about user leaving
    socket.to(roomId).emit('user_left', {
      userId,
      username,
      timestamp: new Date()
    });
    
    console.log(`User ${userId} left room ${roomId}`);
  } catch (error) {
    console.error('Error leaving room:', error);
  }
};

module.exports = {
  handleJoinRoom,
  handleLeaveRoom
};
