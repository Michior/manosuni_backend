import pool from '../config/db.js';


const parsePage = (v, def) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : def;
};

export async function listActivities(req, res, next) {
    try {
        const {
            status,
            ngo_id,
            q,
            page = 1,
            limit = 10,
        } = req.query;

        const p = parsePage(page, 1);
        const l = parsePage(limit, 10);
        const off = (p - 1) * l;

        const where = [];
        const params = [];
        let i = 1;

        if (ngo_id) {
            where.push(`a.ngo_id = $${i++}`);
            params.push(Number(ngo_id));
        }
        if (status) {
            where.push(`a.status = $${i++}`);
            params.push(status);
        }
        if (q) {
            where.push(`(a.title ILIKE $${i} OR a.description ILIKE $${i})`);
            params.push(`%${q}%`);
            i++;
        }

        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const sql = `
      SELECT a.activity_id, a.ngo_id, a.title, a.description, a.category,
             a.modality, a.start_datetime, a.end_datetime, a.hours_value,
             a.capacity, a.status, a.created_at, a.updated_at,
             COALESCE(enr.enrolled_count, 0) AS enrolled_count
      FROM activities a
      LEFT JOIN (
        SELECT activity_id, COUNT(*) AS enrolled_count
        FROM enrollments
        WHERE status IN ('enrolled','completed')
        GROUP BY activity_id
      ) enr ON enr.activity_id = a.activity_id
      ${whereSql}
      ORDER BY a.start_datetime ASC
      LIMIT ${l} OFFSET ${off};
    `;

        const totalSql = `
      SELECT COUNT(*)::int AS total
      FROM activities a
      ${whereSql};
    `;

        const [rows, totalRows] = await Promise.all([
            pool.query(sql, params),
            pool.query(totalSql, params),
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

export async function createActivity(req, res, next) {
    try {
        const {
            ngo_id,
            title,
            description,
            category,
            modality,
            start_datetime,
            end_datetime,
            hours_value,
            capacity,
            status = 'draft',
        } = req.body;

        if (!ngo_id || !title || !start_datetime || !end_datetime) {
            return res.status(400).json({ ok: false, error: 'Missing required fields' });
        }

        const sql = `
      INSERT INTO activities
        (ngo_id, title, description, category, modality,
         start_datetime, end_datetime, hours_value, capacity, status)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;
        const params = [
            Number(ngo_id),
            title,
            description ?? null,
            category ?? null,
            modality ?? 'onsite',
            new Date(start_datetime),
            new Date(end_datetime),
            hours_value ?? 0,
            capacity ?? null,
            status,
        ];

        const result = await pool.query(sql, params);
        return res.status(201).json({ ok: true, data: result.rows[0] });
    } catch (err) {
        next(err);
    }
}

export async function updateActivity(req, res, next) {
    try {
        const { activity_id } = req.params;

        const {
            title,
            description,
            category,
            modality,
            start_datetime,
            end_datetime,
            hours_value,
            capacity,
            status,
        } = req.body;

        const sets = [];
        const params = [];
        let i = 1;
        const pushSet = (col, val) => {
            sets.push(`${col} = $${i++}`);
            params.push(val);
        };

        if (title !== undefined) pushSet('title', title);
        if (description !== undefined) pushSet('description', description);
        if (category !== undefined) pushSet('category', category);
        if (modality !== undefined) pushSet('modality', modality);
        if (start_datetime !== undefined) pushSet('start_datetime', new Date(start_datetime));
        if (end_datetime !== undefined) pushSet('end_datetime', new Date(end_datetime));
        if (hours_value !== undefined) pushSet('hours_value', hours_value);
        if (capacity !== undefined) pushSet('capacity', capacity);
        if (status !== undefined) pushSet('status', status);

        if (!sets.length) {
            return res.status(400).json({ ok: false, error: 'No fields to update' });
        }

        sets.push(`updated_at = NOW()`);

        const sql = `
      UPDATE activities
      SET ${sets.join(', ')}
      WHERE activity_id = $${i}
      RETURNING *;
    `;
        params.push(Number(activity_id));

        const result = await pool.query(sql, params);
        if (!result.rowCount) {
            return res.status(404).json({ ok: false, error: 'Activity not found' });
        }
        return res.json({ ok: true, data: result.rows[0] });
    } catch (err) {
        next(err);
    }
}
