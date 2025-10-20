import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // test DB connection
    await pool.query('SELECT 1');
    console.log('Connected to Postgres');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
}

start();