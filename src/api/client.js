import { config } from '../utils/config';

/**
 * Shared fetch wrapper. The server answers failures with
 * `{ error: message }` and the upstream status, so surface that message —
 * it's written to be read by whoever is setting the repo up.
 */
export async function request(path, { method = 'GET', body } = {}) {
  let response;

  try {
    response = await fetch(`${config.apiUrl}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      `Can't reach the API at ${config.apiUrl}. Is the dev server running? (npm run dev)`,
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status})`);
  }

  return payload;
}
