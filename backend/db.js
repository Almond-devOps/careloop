const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "careloop.sqlite"));

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    caregiver_name TEXT,
    caregiver_email TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('taken', 'skipped')),
    note TEXT,
    logged_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  );

  CREATE TABLE IF NOT EXISTS digests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    week_start TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  );
`);

// Ensure there's always at least one demo patient to log against.
const existing = db.prepare("SELECT COUNT(*) AS n FROM patients").get();
if (existing.n === 0) {
  db.prepare(
    `INSERT INTO patients (name, caregiver_name, caregiver_email)
     VALUES (?, ?, ?)`
  ).run("Demo Patient", "Demo Caregiver", "caregiver@example.com");
}

module.exports = db;
