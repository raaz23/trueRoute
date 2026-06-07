import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "tr_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "trueroute-change-me-in-production";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "trueroute2025";
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createAdminToken() {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin:${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  try {
    if (expected.length !== sig.length) return false;
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  } catch {
    return false;
  }
  const [, expStr] = payload.split(":");
  const exp = Number(expStr);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE_NAME)?.value);
}

export function adminCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function clearAdminCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export function checkAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (expected.length !== password.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(password));
  } catch {
    return false;
  }
}
