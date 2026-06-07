/** Edge-safe admin cookie verification (middleware) */

const COOKIE_NAME = "tr_admin_session";

function getSecret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "trueroute-change-me-in-production"
  );
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminTokenEdge(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmacSha256(payload, getSecret());
  if (expected.length !== sig.length) return false;
  let match = 0;
  for (let i = 0; i < expected.length; i++) {
    match |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  if (match !== 0) return false;
  const exp = Number(payload.split(":")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
