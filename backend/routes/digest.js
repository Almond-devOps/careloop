const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const db = require("../db");

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildPrompt(patient, logs) {
  const logLines = logs
    .map((l) => {
      const date = l.logged_at.split(" ")[0];
      const note = l.note ? ` — note: "${l.note}"` : "";
      return `${date}: ${l.status}${note}`;
    })
    .join("\n");

  return `You are writing a short weekly update for a family caregiver about
their loved one's medication adherence. Be warm, plain-spoken, and non-clinical
— this is going to a family member, not a doctor. Keep it under 120 words.

Patient: ${patient.name}
This week's log (most recent first):
${logLines || "No logs recorded this week."}

Write the digest. If you notice a pattern (e.g. missed doses clustering on
certain days, or missed doses coinciding with a symptom note), gently point it
out and suggest checking in — don't diagnose or speculate about causes.
If adherence was good, say so plainly and keep it brief.`;
}

// POST /api/digest
// body: { patientId }
router.post("/", async (req, res) => {
  const patientId = Number(req.body.patientId) || 1;

  const patient = db
    .prepare(`SELECT * FROM patients WHERE id = ?`)
    .get(patientId);

  if (!patient) {
    return res.status(404).json({ error: "patient not found" });
  }

  const logs = db
    .prepare(
      `SELECT * FROM logs
       WHERE patient_id = ?
         AND logged_at >= datetime('now', '-7 days')
       ORDER BY logged_at DESC`
    )
    .all(patientId);

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      messages: [{ role: "user", content: buildPrompt(patient, logs) }],
    });

    const content = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    db.prepare(
      `INSERT INTO digests (patient_id, content, week_start)
       VALUES (?, ?, ?)`
    ).run(patientId, content, weekStart.toISOString().split("T")[0]);

    // TODO: wire up real email delivery (Resend/SendGrid/nodemailer).
    // For the hackathon demo, logging to console + returning it is enough
    // to show the loop closing end to end.
    console.log(
      `\n--- Digest for ${patient.caregiver_name} <${patient.caregiver_email}> ---\n${content}\n---\n`
    );

    res.json({ patient: patient.name, digest: content });
  } catch (err) {
    console.error("Digest generation failed:", err);
    res.status(500).json({ error: "failed to generate digest" });
  }
});

// GET /api/digest?patientId=1  -> most recent digest, if any
router.get("/", (req, res) => {
  const patientId = Number(req.query.patientId) || 1;
  const digest = db
    .prepare(
      `SELECT * FROM digests WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1`
    )
    .get(patientId);
  res.json(digest || null);
});

module.exports = router;
