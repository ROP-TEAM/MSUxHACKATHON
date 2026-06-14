import eventsJson from "@/data/events.json";
import usersJson from "@/data/users.json";

type RawEvent = { event_id: string; title: string; location: string; ticket_price: number };
type RawUser = { name: string };

const EVENTS = eventsJson as RawEvent[];
const USERS = usersJson as RawUser[];
const ZONES = ["A", "B", "C", "D", "VIP"];
const STATUSES = ["ชำระแล้ว", "รอชำระ", "ยืนยันแล้ว"];

export type SimOrder = {
  id: string;
  at: number;
  title: string;
  buyer: string;
  zone: string;
  price: number;
  location: string;
  status: string;
};

export type SimSnapshot = {
  orders: SimOrder[];
  paused: boolean;
  totalTickets: number;
  revenue: number;
  added: number;
};

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let uid = 0;
function makeOrder(): SimOrder {
  const ev = rand(EVENTS);
  return {
    id: `sim-${++uid}`,
    at: Date.now(),
    title: ev.title,
    buyer: rand(USERS).name,
    zone: rand(ZONES),
    price: ev.ticket_price,
    location: ev.location,
    status: rand(STATUSES),
  };
}

const INITIAL: SimSnapshot = {
  orders: [],
  paused: false,
  totalTickets: 0,
  revenue: 0,
  added: 0,
};

const SERVER_SNAPSHOT: SimSnapshot = { ...INITIAL };

type Listener = () => void;

function createSimulationStore() {
  let state: SimSnapshot = { ...INITIAL };
  const listeners = new Set<Listener>();
  let timer: ReturnType<typeof setInterval> | null = null;

  function notify() {
    listeners.forEach((l) => l());
  }

  function tick() {
    if (state.paused) return;
    const order = makeOrder();
    state = {
      ...state,
      orders: [order, ...state.orders].slice(0, 20),
      totalTickets: state.totalTickets + 1,
      revenue: state.revenue + order.price,
      added: state.added + 1,
    };
    notify();
  }

  function start() {
    if (timer !== null) return;
    timer = setInterval(tick, 2500);
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
      notify();
    },
    reset() {
      state = { ...INITIAL };
      notify();
    },
  };
}

export const simulationStore = createSimulationStore();
