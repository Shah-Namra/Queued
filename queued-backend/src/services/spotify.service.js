/**
 * Spotify Service
 * 
 * Handles interactions with the Spotify Web API
 */
import axios from 'axios';
import querystring from 'querystring';
import { ExternalServiceError } from '../utils/errors.js';

// Spotify API base URL
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

/**
 * Get Spotify API access token using client credentials
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('Spotify client ID and secret must be defined in environment variables');
    }
    
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      data: querystring.stringify({
        grant_type: 'client_credentials'
      })
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get Spotify access token:', error.response?.data || error.message);
    throw new ExternalServiceError('Failed to authenticate with Spotify');
  }
}

/**
 * Search for tracks on Spotify
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return (default: 20)
 * @returns {Promise<Array>} Array of track objects
 */
async function searchTracks(query, limit = 20) {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios({
      method: 'get',
      url: `${SPOTIFY_API_URL}/search`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        q: query,
        type: 'track',
        limit
      }
    });
    
    // Transform Spotify track objects to our application format
    return response.data.tracks.items.map(track => ({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      albumArtUrl: track.album.images[0]?.url,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url
    }));
  } catch (error) {
    console.error('Spotify search error:', error.response?.data || error.message);
    throw new ExternalServiceError('Failed to search Spotify tracks');
  }
}

/**
 * Get track details by Spotify ID
 * @param {string} trackId - Spotify track ID
 * @returns {Promise<Object>} Track details
 */
async function getTrack(trackId) {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios({
      method: 'get',
      url: `${SPOTIFY_API_URL}/tracks/${trackId}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const track = response.data;
    
    // Transform to our application format
    return {
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      albumArtUrl: track.album.images[0]?.url,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url
    };
  } catch (error) {
    console.error('Spotify get track error:', error.response?.data || error.message);
    throw new ExternalServiceError('Failed to get Spotify track details');
  }
}

module.exports = {
  getAccessToken,
  searchTracks,
  getTrack
};
