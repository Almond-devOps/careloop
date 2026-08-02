# CareLoop

**AI caregiver digest for medication adherence.**
Built for the Orion Global Hackathon — Healthcare & Digital Health track.

## The problem

Family caregivers (adult children, spouses) of people managing chronic conditions
often have no visibility into whether meds are actually being taken — and the
person on meds doesn't want a nagging, complicated tracker app either.

## The idea

- **Patient side (mobile app):** a near-zero-friction daily screen. Tap
  "Took it" / "Skipped it" / optionally log a one-line symptom note. That's it.
- **AI layer:** once a week, the backend sends the log history to Claude, which
  writes a short, human, non-clinical digest — e.g. *"Mom missed her evening
  dose 3x this week, all on days she logged fatigue. Might be worth a call."*
- **Caregiver side:** the digest is delivered by email. No second app to
  install, no second login — the lowest-friction distribution channel that
  still closes the loop.

CareLoop isn't "another adherence tracker" — the differentiator is the
**translation layer**: turning raw yes/no logs into something a busy,
non-clinical caregiver can actually read and act on in 30 seconds.

## Why this fits the brief

- **Innovative** — AI-as-translator, not AI-as-chatbot-bolted-on
- **User-centric** — near-zero friction for the actual patient, zero new app
  for the caregiver
- **Technically sound but weekend-scoped** — SQLite, Expo, one Claude API call
  per digest generation
- **Measurable impact** — adherence rate %, missed-dose streaks, and
  digest-driven caregiver actions are all countable, demoable numbers
- **Scalable** — multi-tenant from day one (every patient/caregiver pair is
  its own row); push notifications and SMS digests are natural v2 additions

## Architecture

```
mobile/  (Expo React Native)
  └── LogScreen        one-tap daily logging
  └── HistoryScreen     streak + adherence % view
  └── SettingsScreen    caregiver email, reminder time
        │
        ▼  REST (JSON)
backend/  (Node + Express + SQLite)
  └── /api/logs          POST daily log, GET history
  └── /api/digest         POST → calls Claude, generates + "sends" digest
  └── db.sqlite            patients, logs, caregivers
```

## Running it

### Backend
```bash
cd backend
cp .env.example .env      # add your ANTHROPIC_API_KEY
npm install
npm start                  # http://localhost:3001
```

### Mobile
```bash
cd mobile
npm install
npx expo start              # scan QR with Expo Go, or press i/a for simulator
```

Set `API_BASE_URL` in `mobile/src/api/client.js` to your backend's local
network address (e.g. `http://192.168.x.x:3001`) so a physical phone can
reach it.

## Weekend build order (suggested)

1. Backend: DB schema + `/api/logs` (POST/GET) — get logging working end to end
2. Mobile: `LogScreen` wired to `/api/logs` — one-tap logging on a real device
3. Mobile: `HistoryScreen` — streak/adherence % from `/api/logs` GET
4. Backend: `/api/digest` — Claude call that turns a week of logs into a
   digest (see `backend/routes/digest.js` prompt)
5. Polish: `SettingsScreen`, empty states, demo data seed script
6. Record demo: seed a week of realistic logs → generate a digest live

## Status

Scaffolded and ready to build on — not yet wired to a live device or a real
inbox. `backend/routes/digest.js` currently logs the generated digest to the
console instead of sending real email; swap in Resend/SendGrid/nodemailer
when you're ready to demo the full loop.
