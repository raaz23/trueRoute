/** Founder / admin identity — server and shared checks */

export function getFounderEmail(): string {
  const raw = process.env.ADMIN_EMAIL || "yadavraj1244@gmail.com";
  return raw.trim().toLowerCase();
}

export function isFounderEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === getFounderEmail();
}

export function isEmailVerified(user: {
  email_confirmed_at?: string | null;
  confirmed_at?: string | null;
} | null): boolean {
  if (!user) return false;
  return Boolean(user.email_confirmed_at ?? user.confirmed_at);
}
