
/**
 * Socket Service Entry Point
 * 
 * This file exports the main socket setup function and other socket utilities
 */
import { setupSocketHandlers } from './handlers';
import { getConnectedUsers, sendToUser } from './utils';

module.exports = {
  setupSocketHandlers,
  getConnectedUsers,
  sendToUser
};
