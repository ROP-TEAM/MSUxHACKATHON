import type { PosterEvent } from "../homeData";
import styles from "./EventSectionRow.module.scss";

function PosterCard({ event }: { event: PosterEvent }) {
  return (
    <a className={styles.card} href={`/events#${event.id}`}>
      <div
        className={styles.poster}
        style={{
          background: `linear-gradient(150deg, ${event.gradient[0]}, ${event.gradient[1]})`,
        }}
      >
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

type Props = {
  title: string;
  events: PosterEvent[];
};

export default function EventSectionRow({ title, events }: Props) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <a className={styles.seeAll} href="/events" aria-label={`ดู${title}ทั้งหมด`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M5 13L13 5M13 5H6M13 5V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </header>

      <div className={styles.rail}>
        {events.map((event, i) => (
          <PosterCard key={`${event.id}-${i}`} event={event} />
        ))}
      </div>
    </section>
  );
}
