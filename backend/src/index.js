import dotenv from 'dotenv';
import app from './server.js';
import pool from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await pool.connect();
    console.log('Connected to Postgres');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
}

start();
