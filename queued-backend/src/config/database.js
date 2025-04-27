/**
 * Database Configuration
 * 
 * This module handles PostgreSQL database connections and provides
 * a reusable query interface for the application.
 */
const { Pool } = require('pg');

// Create a new Pool instance using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection on module load
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

/**
 * Execute a database query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
