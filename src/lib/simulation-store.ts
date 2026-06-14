import eventsJson from "@/data/events.json";

// ═══════════════════════════════════════════════════════════
// Global simulation store — lives outside React so a single
// ticker runs for the whole app and survives page navigation.
// Seat inventory depletes per event/zone; totals persist to
// sessionStorage so a route change or reload keeps the state.
// ═══════════════════════════════════════════════════════════

export type LiveOrder = {
  id: string;
  eventId: string;
  title: string;
  location: string;
  zone: string;
  price: number;
  qty: number;
  total: number;
  remaining: number; // seats left in that zone after this order
  at: number;
};

export type SimSnapshot = {
  orders: LiveOrder[];
  soldToday: number;
  revenue: number;
  totalSold: number;
  totalCapacity: number;
  /** eventId -> seats sold by the simulation so far */
  perEvent: Record<string, number>;
  paused: boolean;
};

type RawEvent = {
  event_id: string;
  title: string;
  location: string;
  ticket_price: number;
};

// ---- config ----

const ZONE_CAPACITY: Record<string, number> = {
  VIP: 60,
  A: 150,
  B: 150,
  C: 200,
  D: 200,
};
const ZONES = Object.keys(ZONE_CAPACITY);
export const CAPACITY_PER_EVENT = Object.values(ZONE_CAPACITY).reduce((a, b) => a + b, 0);

const MAX_RECENT = 6;
const MAX_QTY = 4;
const MIN_DELAY_MS = 2500;
const MAX_EXTRA_DELAY_MS = 5500;
const STORAGE_KEY = "msu-sim-v1";

const events = eventsJson as RawEvent[];

// ---- internal mutable state ----

type ZoneSold = Record<string, number>; // zone -> sold count
type Inventory = Record<string, ZoneSold>; // eventId -> zones

type State = {
  inventory: Inventory;
  orders: LiveOrder[];
  soldToday: number;
  revenue: number;
  totalSold: number;
  paused: boolean;
};

function freshInventory(): Inventory {
  const inv: Inventory = {};
  for (const ev of events) {
    const zones: ZoneSold = {};
    for (const z of ZONES) zones[z] = 0;
    inv[ev.event_id] = zones;
  }
  return inv;
}

function loadPersisted(): Partial<State> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<State>) : null;
  } catch {
    return null;
  }
}

const persisted = loadPersisted();

const state: State = {
  inventory: persisted?.inventory ?? freshInventory(),
  orders: [], // ephemeral toasts — never restored
  soldToday: persisted?.soldToday ?? 0,
  revenue: persisted?.revenue ?? 0,
  totalSold: persisted?.totalSold ?? 0,
  paused: false,
};

const TOTAL_CAPACITY = events.length * CAPACITY_PER_EVENT;

// ---- snapshot (referentially stable until commit) ----

const EMPTY_SNAPSHOT: SimSnapshot = Object.freeze({
  orders: [],
  soldToday: 0,
  revenue: 0,
  totalSold: 0,
  totalCapacity: TOTAL_CAPACITY,
  perEvent: {},
  paused: false,
});

let snapshot: SimSnapshot = buildSnapshot();

function buildPerEvent(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const eventId in state.inventory) {
    let sold = 0;
    const zones = state.inventory[eventId];
    for (const z in zones) sold += zones[z];
    if (sold > 0) out[eventId] = sold;
  }
  return out;
}

function buildSnapshot(): SimSnapshot {
  return {
    orders: state.orders,
    soldToday: state.soldToday,
    revenue: state.revenue,
    totalSold: state.totalSold,
    totalCapacity: TOTAL_CAPACITY,
    perEvent: buildPerEvent(),
    paused: state.paused,
  };
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        inventory: state.inventory,
        soldToday: state.soldToday,
        revenue: state.revenue,
        totalSold: state.totalSold,
      }),
    );
  } catch {
    /* storage full / unavailable — simulation still runs in memory */
  }
}

// ---- listeners ----

const listeners = new Set<() => void>();

function commit(): void {
  snapshot = buildSnapshot();
  persist();
  listeners.forEach((l) => l());
}

// ---- order generation (depletes seats) ----

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function zoneRemaining(eventId: string, zone: string): number {
  return ZONE_CAPACITY[zone] - (state.inventory[eventId]?.[zone] ?? 0);
}

function generateOrder(): LiveOrder | null {
  // Try a handful of random events until one has any free seat.
  for (let attempt = 0; attempt < 8; attempt++) {
    const ev = pickRandom(events);
    const openZones = ZONES.filter((z) => zoneRemaining(ev.event_id, z) > 0);
    if (openZones.length === 0) continue;

    const zone = pickRandom(openZones);
    const remainingBefore = zoneRemaining(ev.event_id, zone);
    const qty = Math.min(1 + Math.floor(Math.random() * MAX_QTY), remainingBefore);

    state.inventory[ev.event_id][zone] += qty;

    return {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventId: ev.event_id,
      title: ev.title,
      location: ev.location,
      zone,
      price: ev.ticket_price,
      qty,
      total: ev.ticket_price * qty,
      remaining: remainingBefore - qty,
      at: Date.now(),
    };
  }
  return null; // everything (sampled) sold out
}

// ---- ticker (single global timer) ----

let timer: ReturnType<typeof setTimeout> | null = null;

function scheduleNext(): void {
  timer = setTimeout(tick, MIN_DELAY_MS + Math.random() * MAX_EXTRA_DELAY_MS);
}

function tick(): void {
  const order = generateOrder();
  if (order) {
    state.orders = [order, ...state.orders].slice(0, MAX_RECENT);
    state.soldToday += order.qty;
    state.revenue += order.total;
    state.totalSold += order.qty;
    commit();
  }
  if (!state.paused) scheduleNext();
}

function startTicker(): void {
  if (timer || state.paused) return;
  scheduleNext();
}

function stopTicker(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

// ---- public API (for useSyncExternalStore) ----

export const simulationStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    startTicker();
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) stopTicker();
    };
  },
  getSnapshot(): SimSnapshot {
    return snapshot;
  },
  getServerSnapshot(): SimSnapshot {
    return EMPTY_SNAPSHOT;
  },
  setPaused(paused: boolean): void {
    if (state.paused === paused) return;
    state.paused = paused;
    if (paused) stopTicker();
    else startTicker();
    commit();
  },
  reset(): void {
    state.inventory = freshInventory();
    state.orders = [];
    state.soldToday = 0;
    state.revenue = 0;
    state.totalSold = 0;
    commit();
  },
};
