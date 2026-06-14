"use client";

import { useState } from "react";
import StageOverview from "@/components/StageOverview/StageOverview";
import { ZoneModal } from "../zoneModal/ZoneModal";
import { getPosterById } from "@/components/home/homeData";

interface EventStageSectionProps {
  eventId: string;
}

export default function EventStageSection({ eventId }: EventStageSectionProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const event = getPosterById(eventId);

  return (
    <>
      <StageOverview
        eventId={eventId}
        onZoneClick={(zoneId) => setActiveZone(zoneId)}
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