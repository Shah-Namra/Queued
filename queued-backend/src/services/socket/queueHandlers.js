/**
 * Queue Event Handlers
 * 
 * Handlers for queue-related socket events
 */

/**
 * Handle song added to queue event
 * @param {Object} io - Socket.io server instance
 * @param {Object} socket - Socket instance
 * @param {Object} data - Event data
 */
const handleSongAdded = (io, socket, { roomId, queueItem }) => {
    // Broadcast to all users in the room
    socket.to(roomId).emit('queue_updated', {
      action: 'add',
      queueItem
    });
  };
  
  /**
   * Handle song removed from queue event
   * @param {Object} io - Socket.io server instance
   * @param {Object} socket - Socket instance
   * @param {Object} data - Event data
   */
  const handleSongRemoved = (io, socket, { roomId, queueItemId, position }) => {
    // Broadcast to all users in the room
    socket.to(roomId).emit('queue_updated', {
      action: 'remove',
      queueItemId,
      position
    });
  };
  
  /**
   * Handle song vote changed event
   * @param {Object} io - Socket.io server instance
   * @param {Object} socket - Socket instance
   * @param {Object} data - Event data
   */
  const handleSongVoted = (io, socket, { roomId, queueItemId, upvotes, downvotes }) => {
    // Broadcast to all users in the room
    socket.to(roomId).emit('vote_updated', {
      queueItemId,
      upvotes,
      downvotes
    });
  };
  
  /**
   * Handle current song changed event
   * @param {Object} io - Socket.io server instance
   * @param {Object} socket - Socket instance
   * @param {Object} data - Event data
   */
  const handleCurrentSongChanged = (io, socket, { roomId, currentSong }) => {
    // Broadcast to all users in the room
    socket.to(roomId).emit('playback_updated', {
      currentSong
    });
  };
  
  /**
   * Handle playback progress update event
   * @param {Object} io - Socket.io server instance
   * @param {Object} socket - Socket instance
   * @param {Object} data - Event data
   */
  const handlePlaybackProgress = (io, socket, { roomId, progress }) => {
    // Broadcast to all users in the room
    socket.to(roomId).emit('progress_updated', {
      progress
    });
  };
  
  module.exports = {
    handleSongAdded,
    handleSongRemoved,
    handleSongVoted,
    handleCurrentSongChanged,
    handlePlaybackProgress
  };
  