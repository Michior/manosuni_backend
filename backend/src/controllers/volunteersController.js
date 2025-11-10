import { pool } from "../config/db.js";

export async function upsertVolunteer(req, res, next) {
  try {
    const { full_name, email, phone } = req.body;
    if (!full_name || !email) {
      return res.status(400).json({ ok: false, error: "full_name y email son requeridos" });
    }

    const sql = `
      INSERT INTO volunteers (full_name, email, phone)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            phone     = EXCLUDED.phone
      RETURNING id, full_name, email, phone;
    `;
    const { rows } = await pool.query(sql, [full_name, email, phone || null]);
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}


export async function listVolunteerRegistrations(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT r.id as registration_id,
              r.status,
              r.registered_at,
              a.id   as activity_id,
              a.title,
              a.description,
              a.starts_at
       FROM registrations r
       JOIN activities a ON a.id = r.activity_id
       WHERE r.volunteer_id = $1
       ORDER BY a.starts_at DESC`,
      [id]
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    next(err);
  }
}
