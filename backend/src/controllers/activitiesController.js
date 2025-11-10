import { pool } from "../config/db.js";

export async function listActivities(req, res, next) {
  try {
    const { search } = req.query;
    const params = [];
    let where = "";

    if (search) {
      params.push(`%${search}%`);
      where = `WHERE title ILIKE $${params.length}`;
    }

    const sql = `
      SELECT id, title, description, starts_at, capacity
      FROM activities
      ${where}
      ORDER BY starts_at ASC
      LIMIT 200;
    `;
    const { rows } = await pool.query(sql, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export async function getActivity(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT id, title, description, starts_at, capacity
       FROM activities WHERE id = $1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: "Activity not found" });
    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}
