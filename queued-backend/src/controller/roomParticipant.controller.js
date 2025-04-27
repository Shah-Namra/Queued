
/**
 * Room Participant Controller
 * 
 * Handles operations related to room participants, such as joining and leaving rooms
 */
import db from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

/**
 * Join an existing room by code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.joinRoom = async (req, res, next) => {
  try {
    const { code } = req.params;
    const userId = req.user.id; // From auth middleware
    
    // Find room by code
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE code = $1 AND is_active = true',
      [code]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found or inactive');
    }
    
    const room = roomResult.rows[0];
    
    // Check if user is already a participant
    const participantResult = await db.query(
      'SELECT * FROM room_participants WHERE room_id = $1 AND user_id = $2',
      [room.id, userId]
    );
    
    if (participantResult.rows.length === 0) {
      // Add user as a participant
      await db.query(
        'INSERT INTO room_participants (room_id, user_id) VALUES ($1, $2)',
        [room.id, userId]
      );
    } else {
      // Update existing participant to active
      await db.query(
        'UPDATE room_participants SET is_active = true WHERE room_id = $1 AND user_id = $2',
        [room.id, userId]
      );
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a participant from a room
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.removeParticipant = async (req, res, next) => {
  try {
    const { roomId, userId } = req.params;
    const creatorId = req.user.id; // From auth middleware
    
    // Check if room exists and user is the creator
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1',
      [roomId]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found');
    }
    
    if (roomResult.rows[0].creator_id !== creatorId) {
      throw new BadRequestError('Only the room creator can remove participants');
    }
    
    // Mark participant as inactive
    await db.query(
      'UPDATE room_participants SET is_active = false WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Leave a room (NEW FEATURE)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    // Verify room exists
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1 AND is_active = true',
      [roomId]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found or inactive');
    }
    
    // Check if user is the creator
    if (roomResult.rows[0].creator_id === userId) {
      throw new BadRequestError('Room creator cannot leave. Use the end session option instead.');
    }
    
    // Mark participant as inactive
    await db.query(
      'UPDATE room_participants SET is_active = false WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Successfully left the room'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get room participants with activity status (NEW FEATURE)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getRoomParticipants = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    
    // Verify room exists
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1',
      [roomId]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found');
    }
    
    // Get all participants with their activity status
    const participantsResult = await db.query(
      `SELECT u.id, u.username, u.avatar_url, rp.joined_at, rp.is_active,
        (rp.user_id = $1) as is_creator
       FROM room_participants rp
       JOIN users u ON rp.user_id = u.id
       WHERE rp.room_id = $2
       ORDER BY is_creator DESC, rp.joined_at ASC`,
      [roomResult.rows[0].creator_id, roomId]
    );
    
    res.status(200).json({
      success: true,
      count: participantsResult.rows.length,
      data: participantsResult.rows
    });
  } catch (error) {
    next(error);
  }
};
