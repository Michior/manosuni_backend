import { pool } from "../config/db.js";

export async function registerToActivity(req, res, next) {
  const client = await pool.connect();
  try {
    const { activityId } = req.params;
    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res.status(400).json({ ok: false, error: "volunteerId es requerido" });
    }

    await client.query("BEGIN");


    const { rows: actRows } = await client.query(
      `SELECT id, capacity, starts_at FROM activities WHERE id = $1 FOR UPDATE`,
      [activityId]
    );
    if (!actRows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ ok: false, error: "Activity not found" });
    }

 
    const { rows: existing } = await client.query(
      `SELECT id FROM registrations WHERE activity_id = $1 AND volunteer_id = $2`,
      [activityId, volunteerId]
    );
    if (existing.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({ ok: false, error: "Volunteer already registered" });
    }

 
    const { rows: countRows } = await client.query(
      `SELECT COUNT(*)::int AS cnt FROM registrations WHERE activity_id = $1`,
      [activityId]
    );
    const registered = countRows[0].cnt;
    if (registered >= actRows[0].capacity) {
      await client.query("ROLLBACK");
      return res.status(409).json({ ok: false, error: "Activity is full" });
    }


    const { rows: regRows } = await client.query(
      `INSERT INTO registrations (activity_id, volunteer_id, status)
       VALUES ($1, $2, 'confirmed')
       RETURNING id, activity_id, volunteer_id, status, registered_at`,
      [activityId, volunteerId]
    );

    await client.query("COMMIT");
    res.status(201).json({ ok: true, data: regRows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}
