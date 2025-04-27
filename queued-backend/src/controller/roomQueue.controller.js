/**
 * Room Queue Controller
 * 
 * Handles operations related to song queues in rooms
 */
const db = require('../config/database');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Get the current song queue for a room
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getRoomQueue = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if room exists
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1 AND is_active = true',
      [id]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found or inactive');
    }
    
    // Get queue with song details and vote counts
    const queueResult = await db.query(
      `SELECT rq.id, rq.position, s.id as song_id, s.spotify_id, s.title, 
              s.artist, s.album, s.album_art_url, s.duration_ms, s.preview_url,
              u.username as suggested_by_username, rq.upvotes, rq.downvotes, 
              rq.is_played, rq.added_at
       FROM room_queue rq
       JOIN songs s ON rq.song_id = s.id
       JOIN users u ON rq.suggested_by = u.id
       WHERE rq.room_id = $1
       ORDER BY rq.is_played, rq.position`,
      [id]
    );
    
    res.status(200).json({
      success: true,
      data: queueResult.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a song to the queue (NEW FEATURE)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.addSongToQueue = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { songId } = req.body;
    const userId = req.user.id;
    
    // Verify room exists and is active
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1 AND is_active = true',
      [roomId]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found or inactive');
    }
    
    // Verify song exists
    const songResult = await db.query(
      'SELECT * FROM songs WHERE id = $1',
      [songId]
    );
    
    if (songResult.rows.length === 0) {
      throw new NotFoundError('Song not found');
    }
    
    // Get current highest position
    const positionResult = await db.query(
      'SELECT COALESCE(MAX(position), 0) as max_position FROM room_queue WHERE room_id = $1',
      [roomId]
    );
    
    const nextPosition = parseInt(positionResult.rows[0].max_position) + 1;
    
    // Add song to queue
    const result = await db.query(
      `INSERT INTO room_queue 
        (room_id, song_id, suggested_by, position, upvotes, downvotes) 
       VALUES ($1, $2, $3, $4, 0, 0) 
       RETURNING *`,
      [roomId, songId, userId, nextPosition]
    );
    
    // Get full song details
    const queueItemResult = await db.query(
      `SELECT rq.id, rq.position, s.id as song_id, s.spotify_id, s.title, 
              s.artist, s.album, s.album_art_url, s.duration_ms, s.preview_url,
              u.username as suggested_by_username, rq.upvotes, rq.downvotes, 
              rq.is_played, rq.added_at
       FROM room_queue rq
       JOIN songs s ON rq.song_id = s.id
       JOIN users u ON rq.suggested_by = u.id
       WHERE rq.id = $1`,
      [result.rows[0].id]
    );
    
    res.status(201).json({
      success: true,
      data: queueItemResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vote for a song in the queue (NEW FEATURE)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.voteSong = async (req, res, next) => {
  try {
    const { queueItemId } = req.params;
    const { voteType } = req.body; // 'up' or 'down'
    const userId = req.user.id;
    
    if (!['up', 'down'].includes(voteType)) {
      throw new BadRequestError('Invalid vote type. Must be "up" or "down"');
    }
    
    // Verify queue item exists
    const queueItemResult = await db.query(
      `SELECT rq.*, r.is_active 
       FROM room_queue rq
       JOIN rooms r ON rq.room_id = r.id
       WHERE rq.id = $1`,
      [queueItemId]
    );
    
    if (queueItemResult.rows.length === 0) {
      throw new NotFoundError('Queue item not found');
    }
    
    if (!queueItemResult.rows[0].is_active) {
      throw new BadRequestError('Room is inactive');
    }
    
    if (queueItemResult.rows[0].is_played) {
      throw new BadRequestError('Cannot vote for a song that has already been played');
    }
    
    // Check if user already voted
    const voteResult = await db.query(
      'SELECT * FROM song_votes WHERE queue_item_id = $1 AND user_id = $2',
      [queueItemId, userId]
    );
    
    // Handle vote
    if (voteResult.rows.length === 0) {
      // User hasn't voted yet, insert new vote
      await db.query(
        'INSERT INTO song_votes (queue_item_id, user_id, vote_type) VALUES ($1, $2, $3)',
        [queueItemId, userId, voteType]
      );
      
      // Update vote count
      if (voteType === 'up') {
        await db.query(
          'UPDATE room_queue SET upvotes = upvotes + 1 WHERE id = $1',
          [queueItemId]
        );
      } else {
        await db.query(
          'UPDATE room_queue SET downvotes = downvotes + 1 WHERE id = $1',
          [queueItemId]
        );
      }
    } else {
      const existingVote = voteResult.rows[0].vote_type;
      
      if (existingVote === voteType) {
        // User is removing their vote
        await db.query(
          'DELETE FROM song_votes WHERE queue_item_id = $1 AND user_id = $2',
          [queueItemId, userId]
        );
        
        // Update vote count
        if (voteType === 'up') {
          await db.query(
            'UPDATE room_queue SET upvotes = upvotes - 1 WHERE id = $1',
            [queueItemId]
          );
        } else {
          await db.query(
            'UPDATE room_queue SET downvotes = downvotes - 1 WHERE id = $1',
            [queueItemId]
          );
        }
      } else {
        // User is changing their vote
        await db.query(
          'UPDATE song_votes SET vote_type = $1 WHERE queue_item_id = $2 AND user_id = $3',
          [voteType, queueItemId, userId]
        );
        
        // Update vote counts
        if (voteType === 'up') {
          await db.query(
            'UPDATE room_queue SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = $1',
            [queueItemId]
          );
        } else {
          await db.query(
            'UPDATE room_queue SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = $1',
            [queueItemId]
          );
        }
      }
    }
    
    // Get updated vote counts
    const updatedQueueItem = await db.query(
      'SELECT id, upvotes, downvotes FROM room_queue WHERE id = $1',
      [queueItemId]
    );
    
    res.status(200).json({
      success: true,
      data: updatedQueueItem.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
