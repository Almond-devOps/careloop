// Seeds a realistic week of logs for the demo patient (id 1) so the
// history view and digest generation have something interesting to show.
const db = require("./db");

const patientId = 1;

const pattern = [
  { daysAgo: 6, status: "taken" },
  { daysAgo: 5, status: "taken" },
  { daysAgo: 4, status: "skipped", note: "felt very tired, forgot" },
  { daysAgo: 3, status: "taken" },
  { daysAgo: 2, status: "skipped", note: "tired again, low energy" },
  { daysAgo: 1, status: "taken" },
  { daysAgo: 0, status: "taken" },
];

const insert = db.prepare(
  `INSERT INTO logs (patient_id, status, note, logged_at)
   VALUES (?, ?, ?, datetime('now', ?))`
);

for (const entry of pattern) {
  insert.run(
    patientId,
    entry.status,
    entry.note || null,
    `-${entry.daysAgo} days`
  );
}

console.log(`Seeded ${pattern.length} logs for patient ${patientId}.`);
