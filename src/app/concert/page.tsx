"use client";
import { useMemo, useSyncExternalStore } from "react";
import StageOverview from "@/components/StageOverview/StageOverview";
import styles from "./page.module.scss";
import { simulationStore } from "@/lib/simulation-store";
import { Ticket } from "./types";
import { SameEvent } from "@/components/sameEvent/SameEvent";
import { Footer } from "@/components/footer/footer";

const ConcertPage = () => {
  const merged = useSyncExternalStore(
    simulationStore.subscribeMerged,
    simulationStore.getMergedSnapshot,
    simulationStore.getMergedServerSnapshot,
  );

  const liveTickets: Ticket[] = useMemo(
    () =>
      merged.map((t) => ({
        ticket_id: t.id,
        user_id: t.user_id,
        event_id: t.event_id,
        seat_zone: t.seat,
        status: t.status,
      })),
    [merged],
  );

  const currentEventId =
    liveTickets.length > 0 ? liveTickets[0].event_id : "";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.stage}>
          <StageOverview
            tickets={liveTickets}
            onZoneClick={(zoneId) => console.log(`Zone ${zoneId} clicked`)}
            eventId={currentEventId}
          />
        </div>
      </div>
      <SameEvent />
      <Footer />
    </div>
  );
};

export default ConcertPage;
