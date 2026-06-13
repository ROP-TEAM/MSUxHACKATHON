"use client";
import StageOverview from "@/components/StageOverview/StageOverview";
import ticketsData from "@/data/event_tickets.json";
import { Ticket } from "@/app/concert/types";

interface EventStageSectionProps {
  eventId: string;
}

export default function EventStageSection({ eventId }: EventStageSectionProps) {
  return (
    <StageOverview
      eventId={eventId} 
      tickets={ticketsData as Ticket[]}
      onZoneClick={(zoneId) => console.log(`Zone ${zoneId} clicked`)}
    />
  );
}