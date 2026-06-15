"use client";

import Link from "next/link";
import type { PosterEvent } from "../homeData";
import PosterCard from "@/components/ui/PosterCard/PosterCard";
import styles from "./EventSectionRow.module.scss";

type Props = {
  title: string;
  events: PosterEvent[];
};

export default function EventSectionRow({ title, events }: Props) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <Link
          className={styles.seeAll}
          href="/events"
          aria-label={`ดู${title}ทั้งหมด`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 13L13 5M13 5H6M13 5V12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </header>

      <div className={styles.rail}>
        {events.map((event, i) => (
          <PosterCard
            key={`${event.id}-${i}`}
            event={event}
            className={styles.railCard}
          />
        ))}
      </div>
    </section>
  );
}
