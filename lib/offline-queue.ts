"use client";

/**
 * Tiny offline-action queue for POST/PUT/DELETE requests that the user fires
 * while offline. We intentionally avoid Service-Worker Background Sync because:
 *   • SW Background Sync requires the SW to re-attach auth cookies, which is
 *     brittle with NextAuth JWT sessions and CSP constraints.
 *   • Users expect a visible "X action chờ đồng bộ" indicator anyway, which
 *     is easier to drive from the main thread.
 *
 * This runs in the tab, persists to IndexedDB so queued actions survive a
 * reload, and replays automatically when the tab regains connectivity. Call
 * sites opt in by wrapping their mutation with `enqueueOfflineAction` only
 * when they know the action is safe to retry (idempotent or user-explicit).
 */

const DB_NAME = "erp-offline-queue";
const STORE = "queue";
const DB_VERSION = 1;

export type QueuedAction = {
  id: string;
  createdAt: number;
  /** Path relative to origin, e.g. `/api/tasks/xxx/complete`. */
  url: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  /** Serialized JSON body, if any. Large/binary payloads are not supported. */
  body?: string;
  /** Human label to show in the indicator. */
  label: string;
  attempts: number;
  lastError?: string;
};

type Listener = (snapshot: QueuedAction[]) => void;
const listeners = new Set<Listener>();

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => Promise<T> | T): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    let result: T;
    Promise.resolve(fn(store))
      .then((r) => {
        result = r;
      })
      .catch(reject);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Low-level enqueue — callers should prefer `enqueueOfflineAction`. */
async function put(action: QueuedAction): Promise<void> {
  await withStore("readwrite", (s) => reqToPromise(s.put(action)));
  await notifyListeners();
}

async function remove(id: string): Promise<void> {
  await withStore("readwrite", (s) => reqToPromise(s.delete(id)));
  await notifyListeners();
}

async function list(): Promise<QueuedAction[]> {
  if (!isBrowser()) return [];
  const all = await withStore<QueuedAction[]>("readonly", (s) => reqToPromise(s.getAll() as IDBRequest<QueuedAction[]>));
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

async function notifyListeners(): Promise<void> {
  const snap = await list();
  for (const l of listeners) {
    try {
      l(snap);
    } catch {
      // ignore listener errors
    }
  }
}

/**
 * Queue a mutation to be retried later. Intended for *idempotent*, low-risk
 * actions — the caller is responsible for deciding when replay is safe.
 */
export async function enqueueOfflineAction(input: Omit<QueuedAction, "id" | "createdAt" | "attempts">): Promise<string> {
  const id = crypto.randomUUID();
  const action: QueuedAction = {
    id,
    createdAt: Date.now(),
    attempts: 0,
    ...input,
  };
  await put(action);
  void processQueue();
  return id;
}

export function subscribeOfflineQueue(listener: Listener): () => void {
  listeners.add(listener);
  // Prime the listener once.
  void list().then((snap) => listener(snap));
  return () => {
    listeners.delete(listener);
  };
}

export async function getOfflineQueue(): Promise<QueuedAction[]> {
  return list();
}

/**
 * Attempt to replay every queued action in FIFO order. Stops at the first
 * transient failure (network offline) but keeps going past HTTP 4xx/5xx so
 * bad requests don't permanently block the queue.
 */
let processing = false;
export async function processQueue(): Promise<void> {
  if (!isBrowser() || processing) return;
  if (!navigator.onLine) return;
  processing = true;
  try {
    const items = await list();
    for (const action of items) {
      try {
        const res = await fetch(action.url, {
          method: action.method,
          headers: { "Content-Type": "application/json", ...(action.headers ?? {}) },
          body: action.body,
          credentials: "same-origin",
        });
        if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429)) {
          // Success or permanent client error — remove from queue.
          await remove(action.id);
        } else {
          // 5xx / 408 / 429 — leave in place, increment attempts, stop for now.
          await put({ ...action, attempts: action.attempts + 1, lastError: `HTTP ${res.status}` });
          break;
        }
      } catch (err) {
        // Network failed — assume we're offline again.
        await put({
          ...action,
          attempts: action.attempts + 1,
          lastError: err instanceof Error ? err.message : "network",
        });
        break;
      }
    }
  } finally {
    processing = false;
  }
}

/** Install once at boot: replay queue whenever we come back online. */
export function installOfflineQueueRunner(): () => void {
  if (!isBrowser()) return () => undefined;
  const onOnline = () => {
    void processQueue();
  };
  window.addEventListener("online", onOnline);
  // Also try once on boot in case online events fired before load.
  void processQueue();
  return () => {
    window.removeEventListener("online", onOnline);
  };
}
