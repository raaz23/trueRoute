import type {
  ChatMessage,
  LocalTouristProfile,
  QueuedActivity,
  QueuedGpsPoint,
  QueuedSubmission,
  QueuedTranslation,
} from "./types";
import { LS_KEYS } from "./types";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(LS_KEYS.sessionId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LS_KEYS.sessionId, id);
  }
  return id;
}

export function getLocalProfile(): LocalTouristProfile | null {
  return readJson<LocalTouristProfile | null>(LS_KEYS.profile, null);
}

export function saveLocalProfile(profile: LocalTouristProfile): void {
  writeJson(LS_KEYS.profile, profile);
}

export function clearLocalProfile(): void {
  localStorage.removeItem(LS_KEYS.profile);
}

export function getLastSyncAt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_KEYS.syncAt);
}

export function setLastSyncAt(iso: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEYS.syncAt, iso);
}

export function getChatHistory(): ChatMessage[] {
  return readJson<ChatMessage[]>(LS_KEYS.chat, []);
}

export function saveChatHistory(messages: ChatMessage[]): void {
  writeJson(LS_KEYS.chat, messages.slice(-80));
}

export function getPendingSubmissions(): QueuedSubmission[] {
  return readJson<QueuedSubmission[]>(LS_KEYS.submissions, []);
}

export function queueSubmission(sub: Omit<QueuedSubmission, "id" | "createdAt">): QueuedSubmission {
  const item: QueuedSubmission = {
    ...sub,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeJson(LS_KEYS.submissions, [...getPendingSubmissions(), item]);
  return item;
}

export function removePendingSubmission(id: string): void {
  writeJson(
    LS_KEYS.submissions,
    getPendingSubmissions().filter((s) => s.id !== id)
  );
}

export function getGpsQueue(): QueuedGpsPoint[] {
  return readJson<QueuedGpsPoint[]>(LS_KEYS.gpsQueue, []);
}

export function queueGpsPoint(
  point: Omit<QueuedGpsPoint, "id" | "createdAt">
): QueuedGpsPoint {
  const item: QueuedGpsPoint = {
    ...point,
    id: `gps-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const q = getGpsQueue();
  writeJson(LS_KEYS.gpsQueue, [...q.slice(-200), item]);
  return item;
}

export function clearGpsQueue(): void {
  writeJson(LS_KEYS.gpsQueue, []);
}

export function getTranslateQueue(): QueuedTranslation[] {
  return readJson<QueuedTranslation[]>(LS_KEYS.translateQueue, []);
}

export function queueTranslation(
  t: Omit<QueuedTranslation, "id" | "createdAt">
): void {
  writeJson(LS_KEYS.translateQueue, [
    ...getTranslateQueue(),
    { ...t, id: `tr-${Date.now()}`, createdAt: new Date().toISOString() },
  ]);
}

export function clearTranslateQueue(): void {
  writeJson(LS_KEYS.translateQueue, []);
}

export function getActivityQueue(): QueuedActivity[] {
  return readJson<QueuedActivity[]>(LS_KEYS.activityQueue, []);
}

export function queueActivity(
  action: Omit<QueuedActivity, "id" | "createdAt">
): void {
  writeJson(LS_KEYS.activityQueue, [
    ...getActivityQueue().slice(-100),
    { ...action, id: `act-${Date.now()}`, createdAt: new Date().toISOString() },
  ]);
}

export function clearActivityQueue(): void {
  writeJson(LS_KEYS.activityQueue, []);
}

export function getWaitlistQueue(): string[] {
  return readJson<string[]>(LS_KEYS.waitlistQueue, []);
}

export function queueWaitlistEmail(email: string): void {
  const q = getWaitlistQueue();
  if (!q.includes(email)) writeJson(LS_KEYS.waitlistQueue, [...q, email]);
}

export function clearWaitlistQueue(): void {
  writeJson(LS_KEYS.waitlistQueue, []);
}

export function isInstallDismissed(): boolean {
  return localStorage.getItem(LS_KEYS.installDismissed) === "1";
}

export function dismissInstallPrompt(): void {
  localStorage.setItem(LS_KEYS.installDismissed, "1");
}

export function getLastDangerAlertId(): string | null {
  return localStorage.getItem(LS_KEYS.lastDangerAlert);
}

export function setLastDangerAlertId(id: string): void {
  localStorage.setItem(LS_KEYS.lastDangerAlert, id);
}
