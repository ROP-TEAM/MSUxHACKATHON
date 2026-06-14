import eventsJson from "@/data/events.json";
import usersJson from "@/data/users.json";
import ticketsJson from "@/data/event_tickets.json";

type RawEvent = { event_id: string; title: string; date: string; location: string; ticket_price: number };
type RawUser = { user_id: string; name: string };
type RawTicket = { ticket_id: string; user_id: string; event_id: string; seat_zone: string; status: string };

const EVENTS = eventsJson as RawEvent[];
const USERS = usersJson as RawUser[];
const TICKETS = ticketsJson as RawTicket[];

// Extract real patterns from actual JSON data — no hardcoded arrays
const REAL_ZONES = [...new Set(TICKETS.map((t) => t.seat_zone))];
const REAL_STATUSES = [...new Set(TICKETS.map((t) => t.status))];

// Build lookup maps from real data
const EVENT_MAP = new Map(EVENTS.map((e) => [e.event_id, e]));
const USER_MAP = new Map(USERS.map((u) => [u.user_id, u]));

// Real base: count + revenue of the resolvable tickets in event_tickets.json.
// Every headline number starts from here, so the UI reflects the full real
// dataset from the first frame (not 0) and feed == overview always.
let BASE_COUNT = 0;
let BASE_REVENUE = 0;
for (const t of TICKETS) {
  const u = USER_MAP.get(t.user_id);
  const e = EVENT_MAP.get(t.event_id);
  if (!u || !e) continue;
  BASE_COUNT++;
  BASE_REVENUE += e.ticket_price;
}

// ── Shared types (consumed by pages across the app) ──────────────────

export type TicketStatus = "CANCELLED" | "USED" | "RESERVED" | "REFUNDED" | "PAID";

export type TicketRow = {
  id: string;
  name: string;
  eventTitle: string;
  location: string;
  date: string;
  seat: string;
  price: number;
  status: TicketStatus;
  icon: string;
  color: string;
  user_id: string;
  event_id: string;
};

// Must be exported — status icons used in overviews page rendering
export const STATUS_CONFIG: Record<TicketStatus, { icon: string; color: string }> = {
  CANCELLED: { icon: "/icon/cancle.svg", color: "#DC2626" },
  USED:      { icon: "/icon/used.svg",   color: "#16A34A" },
  RESERVED:  { icon: "/icon/reserved.svg", color: "#7C3AED" },
  REFUNDED:  { icon: "/icon/refunded.svg", color: "#2563EB" },
  PAID:      { icon: "/icon/paid.svg",    color: "#D97706" },
};

// ── Sim types ────────────────────────────────────────────────────────

export type SimOrder = {
  id: string;
  at: number;
  ticket_id: string;
  user_id: string;
  event_id: string;
  title: string;
  buyer: string;
  zone: string;
  price: number;
  location: string;
  status: string;
};

export type SimSnapshot = {
  orders: SimOrder[];
  purchases: SimOrder[]; // user purchases — never capped, never reset
  paused: boolean;
  totalTickets: number;
  revenue: number;
  added: number;
  speed: number; // multiplier: 1=normal, 2=doubled, 5=fast, 10=max
};

const STORAGE_KEY = "sim-store";

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Persistence ──────────────────────────────────────────────────────

function loadPersisted(): { state: SimSnapshot | null; uid: number } {
  if (typeof window === "undefined") return { state: null, uid: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: null, uid: 0 };
    const parsed = JSON.parse(raw);
    return {
      state: (parsed.state as SimSnapshot) ?? null,
      uid: (parsed.uid as number) ?? 0,
    };
  } catch {
    return { state: null, uid: 0 };
  }
}

function savePersisted(state: SimSnapshot, uid: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, uid }));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

function clearPersisted() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

// ── State ────────────────────────────────────────────────────────────

const persisted = loadPersisted();

let uid = persisted.uid;

const INITIAL = {
  orders: [],
  purchases: [],
  totalTickets: BASE_COUNT,
  revenue: BASE_REVENUE,
  added: 0,
  speed: 1,
  paused: false,
  ...(persisted.state ?? {}),
  // spread may leave paused undefined if saved-state omitted it
} as SimSnapshot;

function makeOrder(): SimOrder {
  const event = rand(EVENTS);
  const user = rand(USERS);
  const zone = rand(REAL_ZONES);
  const status = rand(REAL_STATUSES);
  ++uid;

  return {
    id: `sim-${uid}`,
    at: Date.now(),
    ticket_id: `et-sim-${String(uid).padStart(3, "0")}`,
    user_id: user.user_id,
    event_id: event.event_id,
    title: event.title,
    buyer: user.name,
    zone,
    price: event.ticket_price,
    location: event.location,
    status,
  };
}

const SERVER_SNAPSHOT: SimSnapshot = { ...INITIAL };

type Listener = () => void;

// ── Merge real tickets + sim orders into TicketRow[] ─────────────────

let mergedCache: TicketRow[] | null = null;
let mergedVersion = 0;

function buildMergedRows(state: SimSnapshot): TicketRow[] {
  const real: TicketRow[] = [];
  for (const t of TICKETS) {
    const user = USER_MAP.get(t.user_id);
    const event = EVENT_MAP.get(t.event_id);
    if (!user || !event) continue;
    const cfg = STATUS_CONFIG[t.status as TicketStatus] ?? {
      icon: "/icon/ticket1.svg",
      color: "#888888",
    };
    real.push({
      id: t.ticket_id,
      name: user.name,
      eventTitle: event.title,
      location: event.location,
      date: event.date,
      seat: t.seat_zone,
      price: event.ticket_price,
      status: t.status as TicketStatus,
      icon: cfg.icon,
      color: cfg.color,
      user_id: t.user_id,
      event_id: t.event_id,
    });
  }

  const sim: TicketRow[] = [];
  for (const o of state.orders) {
    const event = EVENT_MAP.get(o.event_id);
    const cfg = STATUS_CONFIG[o.status as TicketStatus] ?? {
      icon: "/icon/ticket1.svg",
      color: "#888888",
    };
    sim.push({
      id: o.ticket_id,
      name: o.buyer,
      eventTitle: o.title,
      location: o.location,
      date: event?.date ?? new Date(o.at).toISOString(),
      seat: o.zone,
      price: o.price,
      status: o.status as TicketStatus,
      icon: cfg.icon,
      color: cfg.color,
      user_id: o.user_id,
      event_id: o.event_id,
    });
  }

  const purchased: TicketRow[] = [];
  for (const o of state.purchases) {
    const event = EVENT_MAP.get(o.event_id);
    const cfg = STATUS_CONFIG[o.status as TicketStatus] ?? {
      icon: "/icon/ticket1.svg",
      color: "#888888",
    };
    purchased.push({
      id: o.ticket_id,
      name: o.buyer,
      eventTitle: o.title,
      location: o.location,
      date: event?.date ?? new Date(o.at).toISOString(),
      seat: o.zone,
      price: o.price,
      status: o.status as TicketStatus,
      icon: cfg.icon,
      color: cfg.color,
      user_id: o.user_id,
      event_id: o.event_id,
    });
  }

  const all = [...real, ...sim, ...purchased];
  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return all;
}

function ensureMerged(state: SimSnapshot): TicketRow[] {
  if (mergedCache === null) {
    mergedCache = buildMergedRows(state);
  }
  return mergedCache;
}

function invalidateMerged() {
  mergedCache = null;
  mergedVersion++;
}

// Stable reference for server-side rendering — never changes
const serverMergedCache = buildMergedRows({ orders: [], purchases: [], paused: false, totalTickets: 0, revenue: 0, added: 0, speed: 1 });

// ── Store factory ────────────────────────────────────────────────────

const BASE_INTERVAL = 2500;
const MAX_ORDERS = 150;

// ── Per-event seat capacity ─────────────────────────────────
// Real event_tickets.json has ~1-4 tickets per event.
// Multiply by 5 for a capacity that allows sim to visually fill up.
// Sim generates ~3 orders/event → events hit sold out quickly at small caps.
const CAPACITY_MULTIPLIER = 2;
const DEFAULT_CAPACITY = 3; // for events with 0 real tickets

function getEventCapacity(eventId: string): number {
  const real = TICKETS.filter((t) => t.event_id === eventId).length;
  if (real === 0) return DEFAULT_CAPACITY;
  return Math.max(real * CAPACITY_MULTIPLIER, DEFAULT_CAPACITY);
}

/** Count of real tickets (paid/used/reserved) for an event */
function getRealSoldCount(eventId: string): number {
  return TICKETS.filter(
    (t) =>
      t.event_id === eventId &&
      (t.status === "PAID" || t.status === "USED" || t.status === "RESERVED"),
  ).length;
}

/** Count of sim orders for an event */
function getSimOrderCount(eventId: string, orders: SimOrder[]): number {
  return orders.filter((o) => o.event_id === eventId).length;
}

/** Live sold-out check — combines real tickets + sim orders against capacity */
export function isEventSoldOut(eventId: string, orders: SimOrder[]): boolean {
  const ev = EVENT_MAP.get(eventId);
  if (!ev || ev.ticket_price === 0) return false; // free events never sold out
  const capacity = getEventCapacity(eventId);
  const filled = getRealSoldCount(eventId) + getSimOrderCount(eventId, orders);
  return filled >= capacity;
}

/** Get current state from the simulation store for sold-out checks */
export function getSimOrdersSnapshot(): SimOrder[] {
  return simulationStore.getSnapshot().orders;
}

function createSimulationStore() {
  let state: SimSnapshot = { ...INITIAL };
  const listeners = new Set<Listener>();
  const mergedListeners = new Set<Listener>();
  let timer: ReturnType<typeof setInterval> | null = null;

  function notifyMerged() {
    mergedListeners.forEach((l) => l());
  }

  function notify() {
    listeners.forEach((l) => l());
  }

  function persist() {
    savePersisted(state, uid);
  }

  function tick() {
    if (state.paused) return;
    const order = makeOrder();
    const orders = [order, ...state.orders].slice(0, MAX_ORDERS);
    // Derive every counter from `orders` (capped) — single source, no drift.
    // Plateaus at BASE + MAX_ORDERS, so the sim visibly "fills up" then holds.
    const simRevenue = orders.reduce((s, o) => s + o.price, 0);
    const purchaseRevenue = state.purchases.reduce((s, o) => s + o.price, 0);
    state = {
      ...state,
      orders,
      totalTickets: BASE_COUNT + orders.length + state.purchases.length,
      revenue: BASE_REVENUE + simRevenue + purchaseRevenue,
      added: orders.length,
    };
    persist();
    invalidateMerged();
    notify();
    notifyMerged();
  }

  function restartTimer() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    if (listeners.size > 0 || mergedListeners.size > 0) {
      const ms = Math.round(BASE_INTERVAL / state.speed);
      timer = setInterval(tick, Math.max(ms, 50)); // min 50ms
    }
  }

  function start() {
    if (timer === null) restartTimer();
  }

  function stop() {
    if (timer === null) return;
    clearInterval(timer);
    timer = null;
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      if (listeners.size === 1) start();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) stop();
      };
    },
    getSnapshot(): SimSnapshot {
      return state;
    },
    getServerSnapshot(): SimSnapshot {
      return SERVER_SNAPSHOT;
    },
    setPaused(paused: boolean) {
      state = { ...state, paused };
      persist();
      notify();
    },
    setSpeed(speed: number) {
      const clamped = Math.max(0.5, Math.min(speed, 10));
      state = { ...state, speed: clamped };
      persist();
      restartTimer();
      notify();
    },
    reset() {
      uid = 0;
      const purchases = state.purchases; // keep user purchases
      const purchaseRevenue = purchases.reduce((s, o) => s + o.price, 0);
      state = {
        orders: [],
        purchases,
        paused: false,
        totalTickets: BASE_COUNT + purchases.length,
        revenue: BASE_REVENUE + purchaseRevenue,
        added: 0,
        speed: 1,
      };
      persist();
      invalidateMerged();
      notify();
      notifyMerged();
    },

    buyTicket(buyEventId: string, buyZone?: string) {
      const ev = EVENT_MAP.get(buyEventId);
      if (!ev) return;
      const me = USERS[0]; // "Somchai Jaidee" — แทนตัวผู้ใช้
      ++uid;
      const purchase: SimOrder = {
        id: `buy-${uid}`,
        at: Date.now(),
        ticket_id: `et-buy-${String(uid).padStart(3, "0")}`,
        user_id: me.user_id,
        event_id: buyEventId,
        title: ev.title,
        buyer: me.name,
        zone: buyZone ?? rand(REAL_ZONES),
        price: ev.ticket_price,
        location: ev.location,
        status: "PAID",
      };
      const purchases = [...state.purchases, purchase];
      const simRevenue = state.orders.reduce((s, o) => s + o.price, 0);
      const purchaseRevenue = purchases.reduce((s, o) => s + o.price, 0);
      state = {
        ...state,
        purchases,
        totalTickets: BASE_COUNT + state.orders.length + purchases.length,
        revenue: BASE_REVENUE + simRevenue + purchaseRevenue,
      };
      persist();
      invalidateMerged();
      notify();
      notifyMerged();
    },

    // ── Merged subscription ───────────────────────────────────────
    subscribeMerged(listener: Listener) {
      mergedListeners.add(listener);
      start();
      return () => {
        mergedListeners.delete(listener);
        if (listeners.size === 0 && mergedListeners.size === 0) stop();
      };
    },
    getMergedSnapshot(): TicketRow[] {
      return ensureMerged(state);
    },
    getMergedServerSnapshot: () => serverMergedCache,
  };
}

export const simulationStore = createSimulationStore();
