const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const { authenticateToken, isRoomHost, isRoomParticipant } = require('../middleware/auth');

/**
 * @route POST /api/rooms
 * @desc Create a new room
 * @access Private
 */
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const room = await Room.create({
      name,
      creatorId: req.user.id
    });

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/rooms/:code
 * @desc Get room details by code
 * @access Private
 */
router.get('/:code', authenticateToken, async (req, res, next) => {
  try {
    const { code } = req.params;
    const room = await Room.findByCode(code);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/rooms/:code/join
 * @desc Join a room
 * @access Private
 */
router.post('/:code/join', authenticateToken, async (req, res, next) => {
  try {
    const { code } = req.params;
    const room = await Room.findByCode(code);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const participant = await Room.join(room.id, req.user.id);
    res.json({ room, participant });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/rooms/:roomId/leave
 * @desc Leave a room
 * @access Private
 */
router.post('/:roomId/leave', authenticateToken, isRoomParticipant, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    await Room.leave(roomId, req.user.id);
    res.json({ message: 'Left room successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/rooms
 * @desc Get user's rooms
 * @access Private
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const rooms = await Room.getUserRooms(req.user.id);
    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/rooms/:roomId
 * @desc Delete a room (host only)
 * @access Private
 */
router.delete('/:roomId', authenticateToken, isRoomHost, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    await Room.leave(roomId, req.user.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 