const express = require("express");
const db = require("../db");

const router = express.Router();

// POST /api/logs
// body: { patientId, status: "taken" | "skipped", note?: string }
router.post("/", (req, res) => {
  const { patientId, status, note } = req.body;

  if (!patientId || !["taken", "skipped"].includes(status)) {
    return res.status(400).json({
      error: "patientId and status ('taken' | 'skipped') are required",
    });
  }

  const result = db
    .prepare(
      `INSERT INTO logs (patient_id, status, note) VALUES (?, ?, ?)`
    )
    .run(patientId, status, note || null);

  const log = db
    .prepare(`SELECT * FROM logs WHERE id = ?`)
    .get(result.lastInsertRowid);

  res.status(201).json(log);
});

// GET /api/logs?patientId=1&days=7
router.get("/", (req, res) => {
  const patientId = Number(req.query.patientId) || 1;
  const days = Number(req.query.days) || 7;

  const logs = db
    .prepare(
      `SELECT * FROM logs
       WHERE patient_id = ?
         AND logged_at >= datetime('now', ?)
       ORDER BY logged_at DESC`
    )
    .all(patientId, `-${days} days`);

  const taken = logs.filter((l) => l.status === "taken").length;
  const total = logs.length;
  const adherenceRate = total === 0 ? null : Math.round((taken / total) * 100);

  res.json({ logs, adherenceRate, total, taken });
});

module.exports = router;
