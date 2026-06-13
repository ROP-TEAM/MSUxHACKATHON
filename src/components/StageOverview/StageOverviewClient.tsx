
'use client';

import StageOverview from './StageOverview';

export default function StageOverviewClient() {
  const handleZoneClick = (id: string) => {
    console.log(id);
  };

  return (
    <StageOverview onZoneClick={handleZoneClick} />
  );
}