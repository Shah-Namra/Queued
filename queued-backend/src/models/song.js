const { pool } = require('../db');

class Song {
  /**
   * Add a song to the queue
   * @param {Object} songData - Song data including room ID, Spotify ID, and metadata
   * @returns {Promise<Object>} Added song object
   */
  static async add({
    roomId,
    spotifyId,
    title,
    artist,
    albumArtUrl,
    durationMs,
    addedBy
  }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get current queue length for position
      const { rows: countRows } = await client.query(
        'SELECT COUNT(*) FROM songs WHERE room_id = $1',
        [roomId]
      );
      const position = parseInt(countRows[0].count) + 1;

      // Add song
      const { rows } = await client.query(
        `INSERT INTO songs (
          room_id, spotify_id, title, artist, album_art_url,
          duration_ms, added_by, position
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [roomId, spotifyId, title, artist, albumArtUrl, durationMs, addedBy, position]
      );

      await client.query('COMMIT');
      return rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Remove a song from the queue
   * @param {string} songId - Song ID
   * @returns {Promise<boolean>} True if successful
   */
  static async remove(songId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get song position
      const { rows: songRows } = await client.query(
        'SELECT room_id, position FROM songs WHERE id = $1',
        [songId]
      );

      if (!songRows[0]) {
        throw new Error('Song not found');
      }

      // Delete song
      await client.query(
        'DELETE FROM songs WHERE id = $1',
        [songId]
      );

      // Update positions of remaining songs
      await client.query(
        `UPDATE songs
         SET position = position - 1
         WHERE room_id = $1 AND position > $2`,
        [songRows[0].room_id, songRows[0].position]
      );

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
   * Vote on a song
   * @param {string} songId - Song ID
   * @param {string} userId - User ID
   * @param {string} voteType - Vote type ('upvote' or 'downvote')
   * @returns {Promise<Object>} Updated song object
   */
  static async vote(songId, userId, voteType) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if user has already voted
      const { rows: existingVoteRows } = await client.query(
        'SELECT vote_type FROM votes WHERE song_id = $1 AND user_id = $2',
        [songId, userId]
      );

      let voteChange = 0;
      if (existingVoteRows.length > 0) {
        // User has already voted
        const existingVote = existingVoteRows[0].vote_type;
        if (existingVote === voteType) {
          // Same vote type, remove vote
          await client.query(
            'DELETE FROM votes WHERE song_id = $1 AND user_id = $2',
            [songId, userId]
          );
          voteChange = voteType === 'upvote' ? -1 : 1;
        } else {
          // Different vote type, update vote
          await client.query(
            `UPDATE votes SET vote_type = $1
             WHERE song_id = $2 AND user_id = $3`,
            [voteType, songId, userId]
          );
          voteChange = voteType === 'upvote' ? 2 : -2;
        }
      } else {
        // New vote
        await client.query(
          'INSERT INTO votes (song_id, user_id, vote_type) VALUES ($1, $2, $3)',
          [songId, userId, voteType]
        );
        voteChange = voteType === 'upvote' ? 1 : -1;
      }

      // Update song vote count
      const { rows: songRows } = await client.query(
        `UPDATE songs
         SET votes = votes + $1
         WHERE id = $2
         RETURNING *`,
        [voteChange, songId]
      );

      await client.query('COMMIT');
      return songRows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get song details with vote information
   * @param {string} songId - Song ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Song details with user's vote
   */
  static async getDetails(songId, userId) {
    const { rows } = await pool.query(
      `SELECT s.*, u.username as added_by_name,
              v.vote_type as user_vote
       FROM songs s
       JOIN users u ON s.added_by = u.id
       LEFT JOIN votes v ON s.id = v.song_id AND v.user_id = $1
       WHERE s.id = $2`,
      [userId, songId]
    );
    return rows[0] || null;
  }

  /**
   * Reorder songs in the queue
   * @param {string} roomId - Room ID
   * @param {Array} newOrder - Array of song IDs in new order
   * @returns {Promise<boolean>} True if successful
   */
  static async reorder(roomId, newOrder) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update positions
      for (let i = 0; i < newOrder.length; i++) {
        await client.query(
          'UPDATE songs SET position = $1 WHERE id = $2 AND room_id = $3',
          [i + 1, newOrder[i], roomId]
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
}

module.exports = Song; 