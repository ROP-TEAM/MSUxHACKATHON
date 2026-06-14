"use client";

import { useSyncExternalStore } from "react";
import { ALL_POSTERS } from "@/components/home/homeData";
import PosterCard from "@/components/ui/PosterCard/PosterCard";
import { simulationStore, CAPACITY_PER_EVENT } from "@/lib/simulation-store";
import styles from "@/components/home/EventSectionRow/EventSectionRow.module.scss";

const TITLE = "ใกล้เต็ม";
const MAX_CARDS = 8;

// Base candidates: every event that still has open seats. Live sim sales
// push each event's fill ratio up so the ordering re-sorts in real time.
const CANDIDATES = ALL_POSTERS.filter((e) => !e.soldOut);

export default function NearlyFullRow() {
  const snap = useSyncExternalStore(
    simulationStore.subscribe,
    simulationStore.getSnapshot,
    simulationStore.getServerSnapshot,
  );

  const events = CANDIDATES.map((event) => {
    const baseRatio = event.fillRatio ?? 0;
    const simSold = snap.perEvent[event.id] ?? 0;
    const liveRatio = Math.min(1, baseRatio + simSold / CAPACITY_PER_EVENT);
    return { event, liveRatio };
  })
    .filter(({ liveRatio }) => liveRatio > 0)
    .sort((a, b) => b.liveRatio - a.liveRatio)
    .slice(0, MAX_CARDS)
    .map(({ event }) => event);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{TITLE}</h2>
        <a className={styles.seeAll} href="/events" aria-label={`ดู${TITLE}ทั้งหมด`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M5 13L13 5M13 5H6M13 5V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </header>

      <div className={styles.rail}>
        {events.map((event, i) => (
          <PosterCard key={`${event.id}-${i}`} event={event} className={styles.railCard} />
        ))}
      </div>
    </section>
  );
}
