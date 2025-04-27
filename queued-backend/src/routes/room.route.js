
/**
 * Room Routes
 * 
 * API endpoints for room-related operations
 */
import express from 'express';
import roomController from '../controllers/room.controller';
import { authenticate, isRoomCreator } from '../middleware/auth.middleware';

const router = express.Router();

// All room routes require authentication
router.use(authenticate);

// Room management routes
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.put('/:id', isRoomCreator, roomController.updateRoom);
router.get('/', roomController.getAllActiveRooms); // NEW: Get all active rooms

// Room participant routes
router.post('/join/:code', roomController.joinRoom);
router.delete('/:roomId/participants/:userId', isRoomCreator, roomController.removeParticipant);
router.post('/:roomId/leave', roomController.leaveRoom); // NEW: Leave a room
router.get('/:roomId/participants', roomController.getRoomParticipants); // NEW: Get room participants

// Room queue routes
router.get('/:id/queue', roomController.getRoomQueue);
router.post('/:roomId/queue', roomController.addSongToQueue); // NEW: Add a song to the queue
router.post('/queue/:queueItemId/vote', roomController.voteSong); // NEW: Vote for a song

module.exports = router;
