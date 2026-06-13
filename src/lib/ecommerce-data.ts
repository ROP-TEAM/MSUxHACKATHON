import eventTicketsJson from "../data/event_tickets.json";
import eventsJson from "../data/events.json";

enum TicketStatus {
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  USED = "USED",
  PAID = "PAID",
  RESERVED = "RESERVED"
}

export type EventTickets = {
  ticket_id: string;
  user_id: string;
  event_id: string;
  seat_zone: string;
  status: TicketStatus;
};

export type Events = {
  event_id: string;
  title: string;
  date: Date;
  location: string;
  ticket_price: number;
};

export const eventTickets = eventTicketsJson as EventTickets[];
export const events: Events[] = eventsJson.map(e => ({ ...e, date: new Date(e.date) }));

// ---- Admin: full snapshot ----
export function getAdminSnapshot() {
  const deliveredRevenue = eventTickets
    .filter(ticket => ticket.status !== TicketStatus.CANCELLED)
    .reduce((sum, ticket) => {
      const ev = events.find(e => e.event_id === ticket.event_id);
      return sum + (ev ? ev.ticket_price : 0);
    }, 0);

  const statusCounts = eventTickets.reduce<Record<string, number>>((counts, ticket) => {
    counts[ticket.status] = (counts[ticket.status] ?? 0) + 1;
    return counts;
  }, {});

  const zoneCounts = eventTickets.reduce<Record<string, number>>((counts, ticket) => {
    counts[ticket.seat_zone] = (counts[ticket.seat_zone] ?? 0) + 1;
    return counts;
  }, {});

  // Per-event stats for admin overview
  const eventStats = events.map(ev => {
    const evTickets = eventTickets.filter(t => t.event_id === ev.event_id);
    const sold = evTickets.filter(t => t.status === TicketStatus.PAID || t.status === TicketStatus.USED).length;
    const pending = evTickets.filter(t => t.status === TicketStatus.RESERVED).length;
    const cancelled = evTickets.filter(t => t.status === TicketStatus.CANCELLED).length;
    const refunded = evTickets.filter(t => t.status === TicketStatus.REFUNDED).length;
    const revenue = sold * ev.ticket_price;
    return {
      event_id: ev.event_id,
      title: ev.title,
      date: ev.date,
      location: ev.location,
      ticket_price: ev.ticket_price,
      sold,
      pending,
      cancelled,
      refunded,
      revenue,
    };
  });

  return {
    totalTickets: eventTickets.length,
    totalEvents: events.length,
    deliveredRevenue,
    statusCounts,
    zoneCounts,
    eventStats,
  };
}

// ---- User: public info only (no financials) ----
export function getUserSnapshot() {
  return events.map(ev => {
    const evTickets = eventTickets.filter(t => t.event_id === ev.event_id);
    const availableZones = [...new Set(evTickets.map(t => t.seat_zone))];
    const hasAvailableSeats = evTickets.some(t => t.status === TicketStatus.RESERVED);
    return {
      event_id: ev.event_id,
      title: ev.title,
      date: ev.date,
      location: ev.location,
      ticket_price: ev.ticket_price,
      availableZones,
      hasAvailableSeats,
    };
  });
}

// ---- Prompt builders ----
export function buildAdminPrompt(question: string) {
  const snapshot = getAdminSnapshot();
  return `
คุณคือ AI analyst ฝั่งแอดมิน ระบบ Event/Ticket (hackathon demo)
ตอบเป็นภาษาไทย กระชับ ใช้ bullet พร้อมตัวเลขจริง
ห้ามแต่งข้อมูลเกินจาก snapshot ถ้าไม่แน่ใจให้บอกว่าต้องมีข้อมูลเพิ่ม

คำถามจากแอดมิน:
${question}

ข้อมูล Admin Snapshot (ข้อมูลครบ รวมยอดขาย/รายได้):
${JSON.stringify(snapshot, null, 2)}
`;
}

export function buildUserPrompt(question: string) {
  const snapshot = getUserSnapshot();
  return `
คุณคือ AI ช่วยเหลือผู้ใช้งานทั่วไป ระบบ Event/Ticket (hackathon demo)
ตอบเป็นภาษาไทย กระชับ เป็นมิตร
ห้ามเปิดเผยข้อมูลยอดขาย รายได้ หรือสถิติหลังบ้านใดๆ
ตอบได้เฉพาะข้อมูล Event สาธารณะ เช่น ชื่อ วัน สถานที่ โซน ราคาตั๋ว

คำถามจากผู้ใช้:
${question}

ข้อมูล Event สาธารณะ:
${JSON.stringify(snapshot, null, 2)}
`;
}

// backward compat
export { buildAdminPrompt as buildGeminiPrompt };
export { getAdminSnapshot as getEventsSnapshot };
