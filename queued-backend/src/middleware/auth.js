const jwt = require('jsonwebtoken');
const { pool } = require('../db');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database to ensure they still exist
    const { rows } = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    next(error);
  }
};

/**
 * Middleware to check if user is a host of the room
 */
const isRoomHost = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const { rows } = await pool.query(
      'SELECT role FROM participants WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );

    if (rows.length === 0 || rows[0].role !== 'host') {
      return res.status(403).json({ error: 'Only room hosts can perform this action' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is a participant in the room
 */
const isRoomParticipant = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const { rows } = await pool.query(
      'SELECT id FROM participants WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'You must be a room participant to perform this action' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
  isRoomHost,
  isRoomParticipant
}; 