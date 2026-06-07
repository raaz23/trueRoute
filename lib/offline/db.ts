import type { OfflineBundle } from "./types";
import { OFFLINE_DB_NAME, OFFLINE_DB_VERSION, OFFLINE_STORE } from "./types";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const req = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(OFFLINE_STORE)) {
        db.createObjectStore(OFFLINE_STORE);
      }
    };
  });
}

export async function saveOfflineBundle(bundle: OfflineBundle): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_STORE, "readwrite");
    tx.objectStore(OFFLINE_STORE).put(bundle, "latest");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineBundle(): Promise<OfflineBundle | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(OFFLINE_STORE, "readonly");
      const req = tx.objectStore(OFFLINE_STORE).get("latest");
      req.onsuccess = () => resolve((req.result as OfflineBundle) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function clearOfflineBundle(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_STORE, "readwrite");
    tx.objectStore(OFFLINE_STORE).delete("latest");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
