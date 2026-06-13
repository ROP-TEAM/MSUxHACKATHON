"use client";
import StageOverview from "@/components/stageOverview/StageOverview";
import ticketsData from "@/data/event_tickets.json";
import { Ticket } from "@/app/concert/types";

export default function EventStageSection() {
  return (
    <StageOverview
      tickets={ticketsData as Ticket[]}
      onZoneClick={(zoneId) => console.log(`Zone ${zoneId} clicked`)}
    />
  );
}