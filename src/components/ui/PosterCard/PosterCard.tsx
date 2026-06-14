"use client";

import { useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import type { PosterEvent } from "@/components/home/homeData";
import { simulationStore, isEventSoldOut, EMPTY_ORDERS } from "@/lib/simulation-store";
import styles from "./PosterCard.module.scss";

type Props = {
  event: PosterEvent;
  className?: string;
};

export default function PosterCard({ event, className }: Props) {
  // Live soldOut — combines real tickets + sim orders
  const orders = useSyncExternalStore(
    simulationStore.subscribe,
    () => simulationStore.getSnapshot().orders,
    () => EMPTY_ORDERS,
  );
  const simSoldOut = isEventSoldOut(event.id, orders);
  const liveSoldOut = event.soldOut || simSoldOut;
  const bg: CSSProperties = {
    "--poster-bg": event.image
      ? `url(${event.image})`
      : `linear-gradient(150deg, ${event.gradient[0]}, ${event.gradient[1]})`,
  } as CSSProperties;

  return (
    <a
      className={`${styles.card}${className ? ` ${className}` : ""}`}
      href={`/events/${event.id}`}
    >
      <div className={styles.poster} style={bg}>
        <span className={styles.sheen} aria-hidden="true" />
        {liveSoldOut && <span className={styles.soldOut}>SOLD OUT</span>}
        <div className={styles.posterText}>
          <strong className={styles.posterTitle}>{event.title}</strong>
          <span className={styles.posterSub}>{event.subtitle}</span>
          <span className={styles.posterDate}>{event.date}</span>
        </div>
      </div>
    </a>
  );
}
