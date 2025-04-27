
/**
 * Song Controller
 * 
 * Handles song-related operations such as searching for songs,
 * adding songs to a room queue, and voting on songs.
 */
import db from '../config/database';
import spotifyService from '../services/spotify.service';
import { NotFoundError, BadRequestError } from '../utils/errors';

/**
 * Search for songs via Spotify API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.searchSongs = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      throw new BadRequestError('Search query is required');
    }
    
    const results = await spotifyService.searchTracks(query);
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a song to a room's queue
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.addSongToQueue = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { spotifyId, title, artist, album, albumArtUrl, durationMs, previewUrl } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Validate required fields
    if (!spotifyId || !title || !artist || !durationMs) {
      throw new BadRequestError('Missing required song information');
    }
    
    // Check if room exists and is active
    const roomResult = await db.query(
      'SELECT * FROM rooms WHERE id = $1 AND is_active = true',
      [roomId]
    );
    
    if (roomResult.rows.length === 0) {
      throw new NotFoundError('Room not found or inactive');
    }
    
    // Check if user is a participant
    const participantResult = await db.query(
      'SELECT * FROM room_participants WHERE room_id = $1 AND user_id = $2 AND is_active = true',
      [roomId, userId]
    );
    
    if (participantResult.rows.length === 0) {
      throw new BadRequestError('You must be an active participant to add songs');
    }
    
    // Find or create the song in the database
    let songId;
    const songResult = await db.query(
      'SELECT id FROM songs WHERE spotify_id = $1',
      [spotifyId]
    );
    
    if (songResult.rows.length === 0) {
      // Create new song
      const newSongResult = await db.query(
        `INSERT INTO songs 
         (spotify_id, title, artist, album, album_art_url, duration_ms, preview_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id`,
        [spotifyId, title, artist, album, albumArtUrl, durationMs, previewUrl]
      );
      songId = newSongResult.rows[0].id;
    } else {
      songId = songResult.rows[0].id;
    }
    
    // Get the next position in the queue
    const positionResult = await db.query(
      'SELECT COALESCE(MAX(position) + 1, 1) as next_position FROM room_queue WHERE room_id = $1',
      [roomId]
    );
    const nextPosition = positionResult.rows[0].next_position;
    
    // Add song to room queue
    const queueResult = await db.query(
      `INSERT INTO room_queue 
       (room_id, song_id, suggested_by, position) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [roomId, songId, userId, nextPosition]
    );
    
    // Get full queue item with song details
    const fullQueueItemResult = await db.query(
      `SELECT rq.id, rq.position, s.id as song_id, s.spotify_id, s.title, 
              s.artist, s.album, s.album_art_url, s.duration_ms, s.preview_url,
              u.username as suggested_by_username, rq.upvotes, rq.downvotes, 
              rq.is_played, rq.added_at
       FROM room_queue rq
       JOIN songs s ON rq.song_id = s.id
       JOIN users u ON rq.suggested_by = u.id
       WHERE rq.id = $1`,
      [queueResult.rows[0].id]
    );
    
    res.status(201).json({
      success: true,
      data: fullQueueItemResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vote on a song in the queue
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.voteSong = async (req, res, next) => {
  try {
    const { queueItemId } = req.params;
    const { voteType } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Validate vote type
    if (!['upvote', 'downvote'].includes(voteType)) {
      throw new BadRequestError('Invalid vote type');
    }
    
    // Check if queue item exists
    const queueItemResult = await db.query(
      `SELECT rq.*, r.id as room_id 
       FROM room_queue rq
       JOIN rooms r ON rq.room_id = r.id
       WHERE rq.id = $1 AND r.is_active = true AND rq.is_played = false`,
      [queueItemId]
    );
    
    if (queueItemResult.rows.length === 0) {
      throw new NotFoundError('Queue item not found, already played, or room inactive');
    }
    
    const queueItem = queueItemResult.rows[0];
    
    // Check if user is a participant
    const participantResult = await db.query(
      'SELECT * FROM room_participants WHERE room_id = $1 AND user_id = $2 AND is_active = true',
      [queueItem.room_id, userId]
    );
    
    if (participantResult.rows.length === 0) {
      throw new BadRequestError('You must be an active participant to vote');
    }
    
    // Check if user has already voted
    const voteResult = await db.query(
      'SELECT * FROM song_votes WHERE queue_item_id = $1 AND user_id = $2',
      [queueItemId, userId]
    );
    
    // Start a transaction
    await db.query('BEGIN');
    
    try {
      if (voteResult.rows.length === 0) {
        // Create new vote
        await db.query(
          'INSERT INTO song_votes (queue_item_id, user_id, vote_type) VALUES ($1, $2, $3)',
          [queueItemId, userId, voteType]
        );
        
        // Update vote counts
        if (voteType === 'upvote') {
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
        const existingVote = voteResult.rows[0];
        
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await db.query(
            'DELETE FROM song_votes WHERE queue_item_id = $1 AND user_id = $2',
            [queueItemId, userId]
          );
          
          // Update vote counts
          if (voteType === 'upvote') {
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
          // Change vote type
          await db.query(
            'UPDATE song_votes SET vote_type = $1 WHERE queue_item_id = $2 AND user_id = $3',
            [voteType, queueItemId, userId]
          );
          
          // Update vote counts
          if (voteType === 'upvote') {
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
      
      // Commit transaction
      await db.query('COMMIT');
      
      // Get updated queue item
      const updatedItemResult = await db.query(
        'SELECT * FROM room_queue WHERE id = $1',
        [queueItemId]
      );
      
      res.status(200).json({
        success: true,
        data: updatedItemResult.rows[0]
      });
    } catch (error) {
      // Rollback transaction on error
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a song from the queue (creator only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.removeSongFromQueue = async (req, res, next) => {
  try {
    const { queueItemId } = req.params;
    const userId = req.user.id; // From auth middleware
    
    // Check if queue item exists and get room info
    const queueItemResult = await db.query(
      `SELECT rq.*, r.creator_id 
       FROM room_queue rq
       JOIN rooms r ON rq.room_id = r.id
       WHERE rq.id = $1 AND r.is_active = true AND rq.is_played = false`,
      [queueItemId]
    );
    
    if (queueItemResult.rows.length === 0) {
      throw new NotFoundError('Queue item not found, already played, or room inactive');
    }
    
    const queueItem = queueItemResult.rows[0];
    
    // Check if user is the room creator
    if (queueItem.creator_id !== userId) {
      throw new BadRequestError('Only the room creator can remove songs');
    }
    
    // Remove votes for this queue item
    await db.query(
      'DELETE FROM song_votes WHERE queue_item_id = $1',
      [queueItemId]
    );
    
    // Remove queue item
    await db.query(
      'DELETE FROM room_queue WHERE id = $1',
      [queueItemId]
    );
    
    // Reorder remaining queue items
    await db.query(
      `UPDATE room_queue 
       SET position = position - 1 
       WHERE room_id = $1 AND position > $2 AND is_played = false`,
      [queueItem.room_id, queueItem.position]
    );
    
    res.status(200).json({
      success: true,
      message: 'Song removed from queue successfully'
    });
  } catch (error) {
    next(error);
  }
};
