import type { CSSProperties } from "react";
import type { PosterEvent } from "@/components/home/homeData";
import styles from "./PosterCard.module.scss";

type Props = {
  event: PosterEvent;
  className?: string;
};

export default function PosterCard({ event, className }: Props) {
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
        {event.soldOut && <span className={styles.soldOut}>SOLD OUT</span>}
        <div className={styles.posterText}>
          <strong className={styles.posterTitle}>{event.title}</strong>
          <span className={styles.posterSub}>{event.subtitle}</span>
          <span className={styles.posterDate}>{event.date}</span>
        </div>
      </div>
    </a>
  );
}
