
/**
 * Room Utilities
 * 
 * Helper functions for room management
 */
import db from '../config/database';

/**
 * Generate a unique 6-character alphanumeric room code
 * @returns {Promise<string>} Unique room code
 */
exports.generateRoomCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let roomCode;
  
  while (!isUnique) {
    // Generate a random 6-character code
    roomCode = '';
    for (let i = 0; i < 6; i++) {
      roomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if code already exists
    const result = await db.query(
      'SELECT code FROM rooms WHERE code = $1',
      [roomCode]
    );
    
    if (result.rows.length === 0) {
      isUnique = true;
    }
  }
  
  return roomCode;
};

/**
 * Check if a user is a room participant
 * @param {number} roomId - Room ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Whether the user is an active participant
 */
exports.isRoomParticipant = async (roomId, userId) => {
  const result = await db.query(
    'SELECT * FROM room_participants WHERE room_id = $1 AND user_id = $2 AND is_active = true',
    [roomId, userId]
  );
  
  return result.rows.length > 0;
};

/**
 * Check if a user is a room creator
 * @param {number} roomId - Room ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Whether the user is the room creator
 */
exports.isRoomCreator = async (roomId, userId) => {
  const result = await db.query(
    'SELECT * FROM rooms WHERE id = $1 AND creator_id = $2',
    [roomId, userId]
  );
  
  return result.rows.length > 0;
};

/**
 * Get room activity statistics
 * @param {number} roomId - Room ID
 * @returns {Promise<Object>} Room statistics
 */
exports.getRoomStats = async (roomId) => {
  // Get total participants count
  const participantsResult = await db.query(
    'SELECT COUNT(*) FROM room_participants WHERE room_id = $1',
    [roomId]
  );
  
  // Get active participants count
  const activeParticipantsResult = await db.query(
    'SELECT COUNT(*) FROM room_participants WHERE room_id = $1 AND is_active = true',
    [roomId]
  );
  
  // Get queue stats
  const queueResult = await db.query(
    `SELECT 
      COUNT(*) as total_songs,
      COUNT(*) FILTER (WHERE is_played = true) as played_songs,
      COUNT(*) FILTER (WHERE is_played = false) as queued_songs,
      SUM(upvotes) as total_upvotes,
      SUM(downvotes) as total_downvotes
     FROM room_queue
     WHERE room_id = $1`,
    [roomId]
  );
  
  return {
    totalParticipants: parseInt(participantsResult.rows[0].count),
    activeParticipants: parseInt(activeParticipantsResult.rows[0].count),
    queue: queueResult.rows[0]
  };
};
