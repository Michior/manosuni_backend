import pool from '../config/db.js';

const parsePage = (v, def) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : def;
};

export async function listVolunteersByActivity(req, res, next) {
    try {
        const { activity_id, page = 1, limit = 20 } = req.query;
        if (!activity_id) return res.status(400).json({ ok: false, error: 'activity_id is required' });

        const p = parsePage(page, 1);
        const l = parsePage(limit, 20);
        const off = (p - 1) * l;

        const sql = `
      SELECT e.enrollment_id,
             e.activity_id,
             e.status AS enrollment_status,
             e.enrolled_at,
             s.student_id,
             s.full_name,
             s.email
      FROM enrollments e
      JOIN students s ON s.student_id = e.student_id
      WHERE e.activity_id = $1
      ORDER BY s.full_name ASC
      LIMIT ${l} OFFSET ${off};
    `;
        const totalSql = `
      SELECT COUNT(*)::int AS total
      FROM enrollments
      WHERE activity_id = $1;
    `;

        const [rows, totalRows] = await Promise.all([
            pool.query(sql, [Number(activity_id)]),
            pool.query(totalSql, [Number(activity_id)]),
        ]);

        return res.json({
            ok: true,
            page: p,
            limit: l,
            total: totalRows.rows[0]?.total ?? 0,
            data: rows.rows,
        });
    } catch (err) {
        next(err);
    }
}

export async function markEnrollmentStatus(req, res, next) {
    try {
        const { enrollment_id } = req.params;
        const { status } = req.body;
        if (!status) return res.status(400).json({ ok: false, error: 'status is required' });

        const allowed = new Set(['enrolled', 'completed', 'cancelled', 'validated', 'absent']);
        if (!allowed.has(status)) {
            return res.status(400).json({ ok: false, error: 'invalid status' });
        }

        const sql = `
      UPDATE enrollments
      SET status = $1
      WHERE enrollment_id = $2
      RETURNING *;
    `;
        const result = await pool.query(sql, [status, Number(enrollment_id)]);
        if (!result.rowCount) {
            return res.status(404).json({ ok: false, error: 'Enrollment not found' });
        }
        return res.json({ ok: true, data: result.rows[0] });
    } catch (err) {
        next(err);
    }
}
