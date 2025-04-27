const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const { authenticateToken, isRoomParticipant, isRoomHost } = require('../middleware/auth');

/**
 * @route POST /api/songs
 * @desc Add a song to the queue
 * @access Private
 */
router.post('/', authenticateToken, isRoomParticipant, async (req, res, next) => {
  try {
    const {
      roomId,
      spotifyId,
      title,
      artist,
      albumArtUrl,
      durationMs
    } = req.body;

    if (!roomId || !spotifyId || !title || !artist || !durationMs) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const song = await Song.add({
      roomId,
      spotifyId,
      title,
      artist,
      albumArtUrl,
      durationMs,
      addedBy: req.user.id
    });

    res.status(201).json(song);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/songs/:songId
 * @desc Remove a song from the queue
 * @access Private
 */
router.delete('/:songId', authenticateToken, isRoomHost, async (req, res, next) => {
  try {
    const { songId } = req.params;
    await Song.remove(songId);
    res.json({ message: 'Song removed successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/songs/:songId/vote
 * @desc Vote on a song
 * @access Private
 */
router.post('/:songId/vote', authenticateToken, isRoomParticipant, async (req, res, next) => {
  try {
    const { songId } = req.params;
    const { voteType } = req.body;

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const song = await Song.vote(songId, req.user.id, voteType);
    res.json(song);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/songs/:songId
 * @desc Get song details
 * @access Private
 */
router.get('/:songId', authenticateToken, isRoomParticipant, async (req, res, next) => {
  try {
    const { songId } = req.params;
    const song = await Song.getDetails(songId, req.user.id);

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/songs/reorder
 * @desc Reorder songs in the queue
 * @access Private
 */
router.put('/reorder', authenticateToken, isRoomHost, async (req, res, next) => {
  try {
    const { roomId, newOrder } = req.body;

    if (!roomId || !Array.isArray(newOrder)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    await Song.reorder(roomId, newOrder);
    res.json({ message: 'Queue reordered successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 