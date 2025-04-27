/**
 * Chat Event Handlers
 * 
 * Handlers for chat-related socket events
 */
import db from '../../config/database';

/**
 * Handle sending a chat message
 * @param {Object} io - Socket.io server instance
 * @param {Object} socket - Socket instance
 * @param {Object} data - Event data
 */
const handleSendMessage = async (io, socket, { roomId, message }) => {
  try {
    const userId = socket.user.id;
    
    // Check if user is a participant
    const participantResult = await db.query(
      'SELECT * FROM room_participants WHERE room_id = $1 AND user_id = $2 AND is_active = true',
      [roomId, userId]
    );
    
    if (participantResult.rows.length === 0) {
      socket.emit('error', { message: 'You must be an active participant to send messages' });
      return;
    }
    
    // Store message in database
    const result = await db.query(
      'INSERT INTO chat_messages (room_id, user_id, message) VALUES ($1, $2, $3) RETURNING id, created_at',
      [roomId, userId, message]
    );
    
    const messageData = result.rows[0];
    
    // Get user info
    const userResult = await db.query(
      'SELECT username, avatar_url FROM users WHERE id = $1',
      [userId]
    );
    
    const user = userResult.rows[0];
    
    // Broadcast message to room
    io.to(roomId).emit('new_message', {
      id: messageData.id,
      roomId,
      message,
      user: {
        id: userId,
        username: user.username,
        avatarUrl: user.avatar_url
      },
      timestamp: messageData.created_at
    });
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
};

module.exports = {
  handleSendMessage
};
