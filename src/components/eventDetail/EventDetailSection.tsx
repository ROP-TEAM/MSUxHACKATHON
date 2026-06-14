"use client";

import { useState, useMemo } from "react";
import StageOverview from "@/components/StageOverview/StageOverview";
import ticketsData from "@/data/event_tickets.json";
import { Ticket } from "@/app/concert/types";
import { ZoneModal } from "../zoneModal/ZoneModal";
import { getPosterById } from "@/components/home/homeData";

interface ZoneSummary {
  total: number;
  used: number;
  reserved: number;
  cancelled: number;
  refunded: number;
  paid: number;
}

function summarizeByTicketZone(tickets: Ticket[]): Record<string, ZoneSummary> {
  const map: Record<string, ZoneSummary> = {};
  for (const t of tickets) {
    const zone = t.seat_zone;
    if (!map[zone]) {
      map[zone] = { total: 0, used: 0, reserved: 0, cancelled: 0, refunded: 0, paid: 0 };
    }
    map[zone].total += 1;
    switch (t.status) {
      case "USED":      map[zone].used += 1;      break;
      case "RESERVED":  map[zone].reserved += 1;  break;
      case "CANCELLED": map[zone].cancelled += 1; break;
      case "REFUNDED":  map[zone].refunded += 1;  break;
      case "PAID":      map[zone].paid += 1;       break;
    }
  }
  return map;
}

interface EventStageSectionProps {
  eventId: string;
}

export default function EventStageSection({ eventId }: EventStageSectionProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const event = getPosterById(eventId);
  const tickets = ticketsData as Ticket[];

  const ticketZoneSummary = useMemo(() => {
    const eventTickets = tickets.filter((t) => t.event_id === eventId);
    return summarizeByTicketZone(eventTickets);
  }, [tickets, eventId]);

  return (
    <>
      <StageOverview
        eventId={eventId}
        tickets={tickets}
        onZoneClick={(zoneId) => setActiveZone(zoneId)}
        tooltipMode="selection"
      />

     <ZoneModal
  isActive={activeZone !== null}
  onClose={() => setActiveZone(null)}
  zoneId={activeZone}
  eventId={eventId}
  eventTitle={event?.title ?? ""}
/>
     
    </>
  );
}