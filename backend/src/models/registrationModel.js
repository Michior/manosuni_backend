import { pool } from '../config/db.js';

export async function registerToActivityDB(activityId, volunteerId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const activity = await client.query(
            'SELECT id, capacity FROM activities WHERE id = $1 FOR UPDATE',
            [activityId]
        );
        if (activity.rows.length === 0) {
            await client.query('ROLLBACK');
            return { ok: false, status: 404, error: 'Actividad no encontrada' };
        }

        const already = await client.query(
            'SELECT id FROM registrations WHERE activity_id = $1 AND volunteer_id = $2',
            [activityId, volunteerId]
        );
        if (already.rows.length > 0) {
            await client.query('ROLLBACK');
            return { ok: false, status: 409, error: 'El voluntario ya está inscrito' };
        }

        const count = await client.query(
            'SELECT COUNT(*)::int AS total FROM registrations WHERE activity_id = $1',
            [activityId]
        );
        if (count.rows[0].total >= activity.rows[0].capacity) {
            await client.query('ROLLBACK');
            return { ok: false, status: 409, error: 'No hay cupos disponibles' };
        }

        const insert = await client.query(
            `INSERT INTO registrations (activity_id, volunteer_id, status)
       VALUES ($1, $2, 'confirmed')
       RETURNING id, activity_id, volunteer_id, status, registered_at`,
            [activityId, volunteerId]
        );

        await client.query('COMMIT');
        return { ok: true, data: insert.rows[0] };
    } catch (err) {
        await client.query('ROLLBACK');
        return { ok: false, status: 500, error: 'Error interno' };
    } finally {
        client.release();
    }
}