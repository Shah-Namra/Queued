/**
 * Room Management Controller
 * 
 * Handles core room operations such as creating, updating, and deleting rooms
 */
import db from '../config/database';
import { generateRoomCode } from '../utils/room.utils';
import { NotFoundError, BadRequestError } from '../utils/errors';

/**
 * Create a new room
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createRoom = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // From auth middleware
    
    if (!name) {
      throw new BadRequestError('Room name is required');
    }

    // Generate a unique 6-character room code
    const roomCode = await generateRoomCode();
    
    // Create room in database
    const result = await db.query(
      'INSERT INTO rooms (code, name, creator_id) VALUES ($1, $2, $3) RETURNING *',
      [roomCode, name, userId]
    );
    
    const room = result.rows[0];
    
    // Add creator as a participant
    await db.query(
      'INSERT INTO room_participants (room_id, user_id) VALUES ($1, $2)',
      [room.id, userId]
    );
    
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get room details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT r.*, u.username as creator_name 
       FROM rooms r 
       JOIN users u ON r.creator_id = u.id 
       WHERE r.id = $1 AND r.is_active = true`,
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Room not found or inactive');
    }
    
    const room = result.rows[0];
    
    // Get participants
    const participantsResult = await db.query(
      `SELECT u.id, u.username, u.avatar_url, rp.joined_at
       FROM room_participants rp
       JOIN users u ON rp.user_id = u.id
       WHERE rp.room_id = $1 AND rp.is_active = true`,
      [id]
    );
    
    room.participants = participantsResult.rows;
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update room details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Check if room exists and user is the creator
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1',
      [id]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found');
    }
    
    if (roomResult.rows[0].creator_id !== userId) {
      throw new BadRequestError('Only the room creator can update room details');
    }
    
    // Update room details
    const result = await db.query(
      'UPDATE rooms SET name = COALESCE($1, name), is_active = COALESCE($2, is_active) WHERE id = $3 RETURNING *',
      [name, is_active, id]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all active rooms (NEW FEATURE)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllActiveRooms = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT r.id, r.code, r.name, r.created_at, u.username as creator_name,
        (SELECT COUNT(*) FROM room_participants WHERE room_id = r.id AND is_active = true) as participant_count
       FROM rooms r
       JOIN users u ON r.creator_id = u.id
       WHERE r.is_active = true
       ORDER BY r.created_at DESC`
    );
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};
