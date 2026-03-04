type Listener = (data: string) => void;
const listeners = new Map<string, Set<Listener>>();

export function publishInbox(address: string, payload: unknown) {
  listeners.get(address)?.forEach((cb) => cb(JSON.stringify(payload)));
}

export function subscribeInbox(address: string, cb: Listener) {
  if (!listeners.has(address)) listeners.set(address, new Set());
  listeners.get(address)!.add(cb);
  return () => listeners.get(address)?.delete(cb);
}
