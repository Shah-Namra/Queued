/**
 * Room Controller Facade
 * 
 * This file serves as a facade for room-related controllers to
 * maintain backward compatibility with existing routes
 */

// Import controllers
import roomManagementController from './roomManagement.controller';
import roomParticipantController from './roomParticipant.controller';
import roomQueueController from './roomQueue.controller';

// Re-export controllers
module.exports = {
  // Room management operations
  createRoom: roomManagementController.createRoom,
  getRoomById: roomManagementController.getRoomById,
  updateRoom: roomManagementController.updateRoom,
  getAllActiveRooms: roomManagementController.getAllActiveRooms,
  
  // Room participant operations
  joinRoom: roomParticipantController.joinRoom,
  removeParticipant: roomParticipantController.removeParticipant,
  leaveRoom: roomParticipantController.leaveRoom,
  getRoomParticipants: roomParticipantController.getRoomParticipants,
  
  // Room queue operations
  getRoomQueue: roomQueueController.getRoomQueue,
  addSongToQueue: roomQueueController.addSongToQueue,
  voteSong: roomQueueController.voteSong
};
