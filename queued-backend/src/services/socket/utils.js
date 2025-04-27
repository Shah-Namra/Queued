
/**
 * Socket Utilities
 * 
 * Utilities for tracking and managing socket connections
 */

// Store active room connections
const roomConnections = new Map();

/**
 * Get connected users in a room
 * @param {string} roomId - Room ID
 * @returns {Map} Map of connected users (userId -> socketId)
 */
const getConnectedUsers = (roomId) => {
  return roomConnections.get(roomId) || new Map();
};

/**
 * Send event to a specific user in a room
 * @param {Object} io - Socket.io server instance
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {Object} data - Event data
 * @returns {boolean} Whether the message was sent
 */
const sendToUser = (io, roomId, userId, event, data) => {
  const room = roomConnections.get(roomId);
  
  if (!room) {
    return false;
  }
  
  const socketId = room.get(userId);
  
  if (!socketId) {
    return false;
  }
  
  io.to(socketId).emit(event, data);
  return true;
};

/**
 * Add user to room connections map
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @param {string} socketId - Socket ID
 */
const addUserToRoom = (roomId, userId, socketId) => {
  if (!roomConnections.has(roomId)) {
    roomConnections.set(roomId, new Map());
  }
  roomConnections.get(roomId).set(userId, socketId);
};

/**
 * Remove user from room connections map
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @returns {boolean} Whether the user was removed
 */
const removeUserFromRoom = (roomId, userId) => {
  if (roomConnections.has(roomId)) {
    const result = roomConnections.get(roomId).delete(userId);
    
    // Clean up empty maps
    if (roomConnections.get(roomId).size === 0) {
      roomConnections.delete(roomId);
    }
    
    return result;
  }
  return false;
};

/**
 * Find and remove socket from all rooms
 * @param {string} socketId - Socket ID to remove
 * @returns {Array} Array of [roomId, userId] pairs that were removed
 */
const removeSocketFromAllRooms = (socketId) => {
  const removedConnections = [];
  
  for (const [roomId, connections] of roomConnections.entries()) {
    for (const [userId, sid] of connections.entries()) {
      if (sid === socketId) {
        connections.delete(userId);
        removedConnections.push([roomId, userId]);
        
        // Clean up empty maps
        if (connections.size === 0) {
          roomConnections.delete(roomId);
        }
        
        break;
      }
    }
  }
  
  return removedConnections;
};

module.exports = {
  roomConnections,
  getConnectedUsers,
  sendToUser,
  addUserToRoom,
  removeUserFromRoom,
  removeSocketFromAllRooms
};
