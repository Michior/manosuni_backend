import pool from '../config/db.js';

// Obtener todas las solicitudes
export const getAllValidations = async () => {
  const result = await pool.query('SELECT * FROM validations ORDER BY id DESC');
  return result.rows;
};

// Actualizar estado de una solicitud
export const updateValidationStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE validations SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};
