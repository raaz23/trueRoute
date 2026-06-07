/** Block disposable / throwaway domains and invalid tourist signups */

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "sharklasers.com",
  "grr.la",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "yopmail.com",
  "throwaway.email",
  "fakeinbox.com",
  "trashmail.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "mintemail.com",
  "emailondeck.com",
  "tempail.com",
  "burnermail.io",
  "mailnesia.com",
  "spamgourmet.com",
  "mytemp.email",
  "tmpmail.net",
  "tmpmail.org",
  "fakemailgenerator.com",
  "mailcatch.com",
  "inboxkitten.com",
]);

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export type EmailValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateTouristEmail(email: string): EmailValidationResult {
  const normalized = email.trim().toLowerCase();

  if (!normalized || normalized.length > 254) {
    return { ok: false, message: "Enter a valid email address." };
  }

  if (!EMAIL_RE.test(normalized)) {
    return { ok: false, message: "Email format is invalid." };
  }

  const domain = normalized.split("@")[1];
  if (!domain || domain.length < 4) {
    return { ok: false, message: "Email domain looks invalid." };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      ok: false,
      message: "Temporary email addresses are not allowed. Use your real email.",
    };
  }

  // Common typo / fake patterns
  if (
    domain === "example.com" ||
    domain === "test.com" ||
    domain.endsWith(".local") ||
    normalized.includes("test@test")
  ) {
    return { ok: false, message: "Please use a real email you can access." };
  }

  return { ok: true };
}
