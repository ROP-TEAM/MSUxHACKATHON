'use client';

import StageOverview from './StageOverview';

interface StageOverviewClientProps {
  eventId: string;
}

export default function StageOverviewClient({ eventId }: StageOverviewClientProps) {
  const handleZoneClick = (id: string) => {
    console.log(id);
  };

  return (
    <StageOverview eventId={eventId} onZoneClick={handleZoneClick} />
  );
}