import { headers } from "next/headers";

export const SESSION_HEADER = "x-session-id";

export async function getSessionIdFromRequest(request?: Request): Promise<string> {
  if (request) {
    const fromHeader = request.headers.get(SESSION_HEADER);
    if (fromHeader) return fromHeader;
  }
  try {
    const h = await headers();
    const fromHeader = h.get(SESSION_HEADER);
    if (fromHeader) return fromHeader;
  } catch {
    /* client-only */
  }
  return crypto.randomUUID();
}
