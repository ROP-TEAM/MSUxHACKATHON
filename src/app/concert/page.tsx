"use client";
import StageOverview from "@/components/StageOverview/StageOverview";
import styles from "./page.module.scss";
import ticketsData from "@/data/event_tickets.json";
import { Ticket } from "./types";
import { SameEvent } from "@/components/sameEvent/SameEvent";
import { Footer } from "@/components/footer/footer";
const ConcertPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.stage}>
          <StageOverview
            tickets={ticketsData as Ticket[]}
            onZoneClick={(zoneId) => console.log(`Zone ${zoneId} clicked`)}
             eventId="default-event-id"
          />
        </div>
      </div>
      <SameEvent />
      <Footer />
    </div>
  );
};

export default ConcertPage;
