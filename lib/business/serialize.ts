export function parseJsonArray<T = string>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseJsonObject<T extends Record<string, unknown>>(
  raw: string | null | undefined
): T | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as T) : null;
  } catch {
    return null;
  }
}

export function toJsonArray(values: string[] | undefined | null): string | null {
  if (!values?.length) return null;
  return JSON.stringify(values);
}

export function toJsonObject(obj: Record<string, unknown> | undefined | null): string | null {
  if (!obj || !Object.keys(obj).length) return null;
  return JSON.stringify(obj);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function generateQrCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function businessProfileUrl(slug: string, base?: string): string {
  const origin = base ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}/business/${slug}`;
}

export function qrRedirectUrl(qrCode: string, base?: string): string {
  const origin = base ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}/b/${qrCode}`;
}
