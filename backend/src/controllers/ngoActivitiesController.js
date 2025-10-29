import { pool } from '../config/db.js';


export const listActivities = async (req, res) => {
    try {
        const { status, ngo_id, q, page = 1, limit = 10 } = req.query;
        const p = Math.max(1, Number(page));
        const l = Math.max(1, Math.min(100, Number(limit)));
        const offset = (p - 1) * l;

        const where = [];
        const params = [];

        if (status) { params.push(status); where.push(`a.status = $${params.length}`); }
        if (ngo_id) { params.push(Number(ngo_id)); where.push(`a.ngo_id = $${params.length}`); }
        if (q) { params.push(`%${q}%`); where.push(`(a.title ILIKE $${params.length} OR a.description ILIKE $${params.length})`); }

        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const baseSql = `
      FROM activities a
      LEFT JOIN ngos n ON n.ngo_id = a.ngo_id
      ${whereSql}
    `;

        const totalSql = `SELECT COUNT(*) AS total ${baseSql};`;
        const dataSql = `
      SELECT a.activity_id, a.title, a.description, a.category, a.modality,
             a.start_datetime, a.end_datetime, a.hours_value, a.capacity,
             a.status, a.ngo_id, n.name AS ngo_name
      ${baseSql}
      ORDER BY a.start_datetime DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `;

        const totalRes = await pool.query(totalSql, params);
        const dataRes = await pool.query(dataSql, [...params, l, offset]);

        res.json({
            ok: true,
            page: p,
            limit: l,
            total: Number(totalRes.rows[0].total),
            data: dataRes.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
    }
};


export const createActivity = async (req, res) => {
    try {
        const {
            ngo_id, title, description, category, modality = 'onsite',
            start_datetime, end_datetime, hours_value = 0, capacity = null, status = 'open',
        } = req.body;

        if (!ngo_id || !title || !start_datetime) {
            return res.status(400).json({ ok: false, error: 'ngo_id, title y start_datetime son requeridos' });
        }

        const sql = `
      INSERT INTO activities
      (ngo_id, title, description, category, modality, start_datetime, end_datetime, hours_value, capacity, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;
        const params = [ngo_id, title, description, category, modality, start_datetime, end_datetime, hours_value, capacity, status];
        const r = await pool.query(sql, params);

        res.status(201).json({ ok: true, activity: r.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
    }
};


export const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const allowed = [
            'title', 'description', 'category', 'modality', 'start_datetime', 'end_datetime', 'hours_value', 'capacity', 'status',
        ];
        const sets = [];
        const params = [];
        allowed.forEach((k) => {
            if (req.body[k] !== undefined) {
                params.push(req.body[k]);
                sets.push(`${k} = $${params.length}`);
            }
        });
        if (!sets.length) return res.status(400).json({ ok: false, error: 'No hay campos para actualizar' });
        params.push(Number(id));

        const sql = `UPDATE activities SET ${sets.join(', ')}, updated_at = NOW() WHERE activity_id = $${params.length} RETURNING *;`;
        const r = await pool.query(sql, params);
        if (!r.rowCount) return res.status(404).json({ ok: false, error: 'Actividad no encontrada' });

        res.json({ ok: true, activity: r.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
    }
};
