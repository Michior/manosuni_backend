import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config(); 

const { Pool } = pkg;

console.log('🔍 Config DB:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '***' : '(no leída)',
  port: process.env.DB_PORT,
});

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a la base de datos:', err));

export default pool;
