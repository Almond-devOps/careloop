// Point this at your machine's local network IP so a physical phone
// running Expo Go can reach the backend (localhost won't work on-device).
// e.g. "http://192.168.1.42:3001"
export const API_BASE_URL = "http://localhost:3001";

const DEFAULT_PATIENT_ID = 1;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function postLog({ status, note }) {
  return request("/api/logs", {
    method: "POST",
    body: JSON.stringify({ patientId: DEFAULT_PATIENT_ID, status, note }),
  });
}

export function getLogs(days = 7) {
  return request(`/api/logs?patientId=${DEFAULT_PATIENT_ID}&days=${days}`);
}

export function generateDigest() {
  return request("/api/digest", {
    method: "POST",
    body: JSON.stringify({ patientId: DEFAULT_PATIENT_ID }),
  });
}

export function getLatestDigest() {
  return request(`/api/digest?patientId=${DEFAULT_PATIENT_ID}`);
}
