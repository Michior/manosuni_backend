import { pool } from '../config/db.js';


export const listVolunteers = async (req, res) => {
    try {
        const { activity_id, status } = req.query;
        if (!activity_id) return res.status(400).json({ ok: false, error: 'activity_id es requerido' });

        const where = ['e.activity_id = $1'];
        const params = [Number(activity_id)];
        if (status) { params.push(status); where.push(`e.status = $${params.length}`); }

        const sql = `
      SELECT e.enrollment_id, e.status, s.student_id, s.full_name, s.email
      FROM enrollments e
      JOIN students s ON s.student_id = e.student_id
      WHERE ${where.join(' AND ')}
      ORDER BY s.full_name ASC;
    `;
        const r = await pool.query(sql, params);
        res.json({ ok: true, data: r.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
    }
};


export const updateVolunteer = async (req, res) => {
    try {
        const { enrollment_id } = req.params;
        const { status } = req.body;
        if (!['enrolled', 'cancelled', 'completed'].includes(status || ''))
            return res.status(400).json({ ok: false, error: 'status inválido' });

        const sql = `UPDATE enrollments SET status = $1 WHERE enrollment_id = $2 RETURNING *;`;
        const r = await pool.query(sql, [status, Number(enrollment_id)]);
        if (!r.rowCount) return res.status(404).json({ ok: false, error: 'Inscripción no encontrada' });

        res.json({ ok: true, enrollment: r.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
    }
};
