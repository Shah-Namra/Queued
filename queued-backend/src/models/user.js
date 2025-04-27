const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data including username, email, and password
   * @returns {Promise<Object>} Created user object
   */
  static async create({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    return rows[0];
  }

  /**
   * Find user by email
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Find user by ID
   * @param {string} id - User's ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Update user's Spotify token
   * @param {string} userId - User's ID
   * @param {string} spotifyToken - Spotify access token
   * @returns {Promise<Object>} Updated user object
   */
  static async updateSpotifyToken(userId, spotifyToken) {
    const { rows } = await pool.query(
      `UPDATE users 
       SET spotify_token = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, username, email`,
      [spotifyToken, userId]
    );
    return rows[0];
  }

  /**
   * Verify user password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  static generateToken(user) {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * Update user profile
   * @param {string} userId - User's ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object
   */
  static async updateProfile(userId, { username, email }) {
    const { rows } = await pool.query(
      `UPDATE users 
       SET username = COALESCE($1, username),
           email = COALESCE($2, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, username, email, created_at, updated_at`,
      [username, email, userId]
    );
    return rows[0];
  }

  /**
   * Change user password
   * @param {string} userId - User's ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} True if successful
   */
  static async changePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [hashedPassword, userId]
    );
    
    return true;
  }
}

module.exports = User; 