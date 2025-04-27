const { pool } = require('../db');
const { v4: uuidv4 } = require('uuid');

class Room {
  /**
   * Generate a unique room code
   * @returns {Promise<string>} Unique 6-character room code
   */
  static async generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      const { rows } = await pool.query(
        'SELECT id FROM rooms WHERE code = $1',
        [code]
      );
      isUnique = rows.length === 0;
    }

    return code;
  }

  /**
   * Create a new room
   * @param {Object} roomData - Room data including name and creator ID
   * @returns {Promise<Object>} Created room object
   */
  static async create({ name, creatorId }) {
    const code = await this.generateRoomCode();
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create room
      const { rows: roomRows } = await client.query(
        `INSERT INTO rooms (code, name, creator_id)
         VALUES ($1, $2, $3)
         RETURNING id, code, name, created_at`,
        [code, name, creatorId]
      );

      // Add creator as host
      await client.query(
        `INSERT INTO participants (room_id, user_id, role)
         VALUES ($1, $2, 'host')`,
        [roomRows[0].id, creatorId]
      );

      await client.query('COMMIT');
      return roomRows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find room by code
   * @param {string} code - Room code
   * @returns {Promise<Object|null>} Room object or null if not found
   */
  static async findByCode(code) {
    const { rows } = await pool.query(
      `SELECT r.*, u.username as creator_name
       FROM rooms r
       JOIN users u ON r.creator_id = u.id
       WHERE r.code = $1 AND r.is_active = true`,
      [code]
    );
    return rows[0] || null;
  }

  /**
   * Get room details with participants and current queue
   * @param {string} roomId - Room ID
   * @returns {Promise<Object>} Room details with participants and queue
   */
  static async getDetails(roomId) {
    const client = await pool.connect();
    try {
      // Get room info
      const { rows: roomRows } = await client.query(
        `SELECT r.*, u.username as creator_name
         FROM rooms r
         JOIN users u ON r.creator_id = u.id
         WHERE r.id = $1 AND r.is_active = true`,
        [roomId]
      );

      if (!roomRows[0]) {
        return null;
      }

      // Get participants
      const { rows: participantRows } = await client.query(
        `SELECT p.*, u.username
         FROM participants p
         JOIN users u ON p.user_id = u.id
         WHERE p.room_id = $1`,
        [roomId]
      );

      // Get queue
      const { rows: queueRows } = await client.query(
        `SELECT s.*, u.username as added_by_name
         FROM songs s
         JOIN users u ON s.added_by = u.id
         WHERE s.room_id = $1
         ORDER BY s.position ASC`,
        [roomId]
      );

      return {
        ...roomRows[0],
        participants: participantRows,
        queue: queueRows
      };
    } finally {
      client.release();
    }
  }

  /**
   * Join a room
   * @param {string} roomId - Room ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Participant record
   */
  static async join(roomId, userId) {
    const { rows } = await pool.query(
      `INSERT INTO participants (room_id, user_id, role)
       VALUES ($1, $2, 'joiner')
       ON CONFLICT (room_id, user_id) DO NOTHING
       RETURNING *`,
      [roomId, userId]
    );
    return rows[0];
  }

  /**
   * Leave a room
   * @param {string} roomId - Room ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if successful
   */
  static async leave(roomId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Remove participant
      await client.query(
        'DELETE FROM participants WHERE room_id = $1 AND user_id = $2',
        [roomId, userId]
      );

      // Check if room is empty
      const { rows } = await client.query(
        'SELECT COUNT(*) FROM participants WHERE room_id = $1',
        [roomId]
      );

      // If room is empty, deactivate it
      if (rows[0].count === '0') {
        await client.query(
          'UPDATE rooms SET is_active = false WHERE id = $1',
          [roomId]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user's rooms
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of rooms
   */
  static async getUserRooms(userId) {
    const { rows } = await pool.query(
      `SELECT r.*, u.username as creator_name
       FROM rooms r
       JOIN users u ON r.creator_id = u.id
       JOIN participants p ON r.id = p.room_id
       WHERE p.user_id = $1 AND r.is_active = true
       ORDER BY r.updated_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = Room; 