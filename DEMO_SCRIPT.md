# CareLoop — 3-minute demo script

**1. The hook (20s)**
"Millions of people rely on family members to help manage chronic conditions
— but caregivers are flying blind. They either get no visibility, or they get
a nagging app the patient refuses to use. CareLoop is a translation layer:
one-tap logging for the patient, an AI-written digest for the caregiver."

**2. Patient flow (45s)**
- Open the app → LogScreen
- Tap "Took it" — show the instant confirmation
- Tap into the note field once, log "felt a bit tired" with a skip, to set up
  the pattern the digest will catch later

**3. History + adherence (30s)**
- Navigate to History
- Point at the adherence % card — "this is a real, demoable number, not a
  vibe"
- Scroll the log list, show the note attached to the skipped entry

**4. The AI moment (60s)**
- Run `npm run seed` beforehand so there's a week of realistic data
  (2 skipped doses, both with a "tired" note)
- Tap "Generate caregiver digest" live
- Read the generated digest out loud — it should surface the tired/skip
  pattern and suggest checking in, without diagnosing anything
- "This is the whole pitch: raw taps become something a caregiver can read in
  30 seconds and actually act on."

**5. Impact + scale (25s)**
- Adherence %, missed-dose streaks = measurable outcomes
- Every patient/caregiver pair is already its own row in the DB — multi-tenant
  from day one
- Natural v2s: SMS digest instead of email, push reminders, multiple
  caregivers per patient, provider-facing rollup view

## Before you demo

```bash
cd backend && npm install && npm run seed && npm start
cd mobile && npm install && npx expo start
```

Set `mobile/src/api/client.js` → `API_BASE_URL` to your machine's LAN IP if
demoing on a physical phone via Expo Go.
