import type { PosterEvent } from "@/components/home/homeData";
import rawEvents from "@/data/events.json";
import rawTickets from "@/data/event_tickets.json";

// ═══════════════════════════════════════════════════════════
// Adapter: raw events.json + event_tickets.json → PosterEvent[]
// Neither JSON file is modified — enrichment happens here only.
// ═══════════════════════════════════════════════════════════

// ---- raw JSON shapes ----

interface RawEvent {
  event_id: string;
  title: string;
  date: string;
  location: string;
  ticket_price: number;
}

interface RawTicket {
  ticket_id: string;
  user_id: string;
  event_id: string;
  seat_zone: string;
  status: "USED" | "PAID" | "RESERVED" | "CANCELLED" | "REFUNDED";
}

// ---- date formatting: ISO → "26 ก.ค. 2026" ----

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function formatThaiDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${THAI_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear() + 543}`;
}

// ---- category extraction ----

/** Strip trailing year token so "Book Launch 2026" → "Book Launch" */
function extractCategory(title: string): string {
  return title.replace(/\s+\d{4}$/, "");
}

// ---- poster image resolution ----

/**
 * Poster images bundled under public/image/events/.
 * Static map (no fs) so this module stays importable in client bundles.
 * Add new files here when poster art is added.
 */
const POSTER_FILES: Map<string, string> = new Map([
  ["ev-001", "/image/events/ev-001.jpg"],
  ["ev-002", "/image/events/ev-002.jpg"],
  ["ev-003", "/image/events/ev-003.jpg"],
  ["ev-004", "/image/events/ev-004.jpg"],
  ["ev-005", "/image/events/ev-005.jpg"],
  ["ev-006", "/image/events/ev-006.jpg"],
  ["ev-007", "/image/events/ev-007.jpg"],
  ["ev-008", "/image/events/ev-008.jpg"],
  ["ev-009", "/image/events/ev-009.jpg"],
  ["ev-010", "/image/events/ev-010.jpg"],
]);

function resolvePoster(eventId: string): string | undefined {
  return POSTER_FILES.get(eventId);
}

// ---- gradient palette (deterministic by category name) ----

const PALETTE: [string, string][] = [
  ["#e85d9c", "#7b2ff7"],
  ["#5fa8e6", "#bfe3ff"],
  ["#ff7a59", "#c81d77"],
  ["#3a3f4b", "#11131a"],
  ["#00c2a8", "#1a3a6b"],
  ["#ff4d8d", "#ffb347"],
  ["#1e2a44", "#0a0e1a"],
  ["#f857a6", "#ff5858"],
  ["#2f80ed", "#56ccf2"],
  ["#11998e", "#38ef7d"],
  ["#a8e063", "#8e6bff"],
  ["#56ccf2", "#6a5af9"],
  ["#c81d77", "#1a0a2e"],
  ["#7b2ff7", "#f107a3"],
  ["#e53935", "#ff8a65"],
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickGradient(category: string): [string, string] {
  return PALETTE[hashStr(category) % PALETTE.length];
}

// ---- sold-out detection ----

type TicketCounts = Map<string, { sold: number; total: number }>;

function aggregateTickets(tickets: RawTicket[]): TicketCounts {
  const map: TicketCounts = new Map();
  for (const t of tickets) {
    if (!map.has(t.event_id)) {
      map.set(t.event_id, { sold: 0, total: 0 });
    }
    const e = map.get(t.event_id)!;
    e.total += 1;
    if (t.status === "USED" || t.status === "PAID" || t.status === "RESERVED") {
      e.sold += 1;
    }
  }
  return map;
}

function isSoldOut(
  eventId: string,
  price: number,
  ticketCounts: TicketCounts,
  allCounts: number[],
): boolean {
  if (price === 0) return true;
  const c = ticketCounts.get(eventId);
  if (!c || c.total === 0) return false;
  const sorted = [...allCounts].sort((a, b) => b - a);
  const cutoff = sorted[Math.floor(sorted.length * 0.25)];
  if (cutoff === undefined) return false;
  return c.total >= cutoff && c.sold / c.total >= 0.6;
}

// ---- main adapter ----

let _cache: PosterEvent[] | null = null;

export function getAllPosterEvents(): PosterEvent[] {
  if (_cache) return _cache;

  const tickets = rawTickets as RawTicket[];
  const ticketCounts = aggregateTickets(tickets);
  const allCounts = Array.from(ticketCounts.values()).map((c) => c.total);

  _cache = (rawEvents as RawEvent[]).map((e) => {
    const category = extractCategory(e.title);
    const gradient = pickGradient(category);
    const c = ticketCounts.get(e.event_id);
    const fillRatio = c && c.total > 0 ? c.sold / c.total : 0;

    return {
      id: e.event_id,
      title: e.title,
      subtitle: category,
      date: formatThaiDate(e.date),
      rawDate: e.date,
      gradient,
      accent: gradient[0],
      image: resolvePoster(e.event_id),
      venue: e.location,
      price: e.ticket_price,
      soldOut: isSoldOut(e.event_id, e.ticket_price, ticketCounts, allCounts),
      fillRatio,
    } satisfies PosterEvent;
  });

  return _cache;
}

export function getPosterById(id: string): PosterEvent | undefined {
  return getAllPosterEvents().find((p) => p.id === id);
}

/** 3 fixed sections: ใกล้เต็ม · ใหม่ล่าสุด · ใกล้ถึงวันงาน */
export function getSections(): { title: string; events: PosterEvent[] }[] {
  const all = getAllPosterEvents();
  const tickets = rawTickets as RawTicket[];
  const ticketCounts = aggregateTickets(tickets);

  // attach fill ratio for ใกล้เต็ม sorting
  const withFill = all.map((e) => {
    const c = ticketCounts.get(e.id);
    const ratio = c && c.total > 0 ? c.sold / c.total : 0;
    return { event: e, ratio };
  });

  const now = new Date("2026-06-14T00:00:00Z");

  // 1. ใกล้เต็ม — top fill ratio, not sold out, at least some tickets sold
  const nearlyFull = withFill
    .filter(({ event, ratio }) => !event.soldOut && ratio > 0)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 8)
    .map(({ event }) => event);

  // 2. ใหม่ล่าสุด — highest event_id suffix
  const newest = [...all]
    .sort((a, b) => {
      const aNum = parseInt(a.id.replace("ev-", ""), 10);
      const bNum = parseInt(b.id.replace("ev-", ""), 10);
      return bNum - aNum;
    })
    .slice(0, 8);

  // 3. ใกล้ถึงวันงาน — future dates, closest first
  const upcoming = all
    .filter((e) => new Date(e.rawDate) >= now)
    .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())
    .slice(0, 8);

  return [
    { title: "ใกล้เต็ม", events: nearlyFull },
    { title: "ใหม่ล่าสุด", events: newest },
    { title: "ใกล้ถึงวันงาน", events: upcoming },
  ];
}

/** Group events by category (from title) — for /events page */
export function getCategorySections(): { title: string; events: PosterEvent[] }[] {
  const all = getAllPosterEvents();
  const map = new Map<string, PosterEvent[]>();

  for (const e of all) {
    const cat = extractCategory(e.title);
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(e);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([title, events]) => ({ title, events }));
}
