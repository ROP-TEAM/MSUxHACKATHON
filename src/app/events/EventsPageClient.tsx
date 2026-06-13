"use client";

import { useState, useMemo } from "react";
import type { PosterEvent } from "@/components/home/homeData";
import styles from "./EventsPageClient.module.scss";

type SortKey = "newest" | "soonest" | "priceAsc" | "priceDesc" | "fillRatio";

const SORT_LABELS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "ใหม่ล่าสุด" },
  { key: "soonest", label: "ใกล้ถึงวันงาน" },
  { key: "priceAsc", label: "ราคาต่ำ → สูง" },
  { key: "priceDesc", label: "ราคาสูง → ต่ำ" },
  { key: "fillRatio", label: "ใกล้เต็ม" },
];

type Props = {
  allEvents: PosterEvent[];
  categories: string[];
};

export default function EventsPageClient({ allEvents, categories }: Props) {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");

  const now = useMemo(() => new Date("2026-06-14T00:00:00Z"), []);

  const filtered = useMemo(() => {
    let list = [...allEvents];

    // search by title or subtitle
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q),
      );
    }

    // category filter
    if (activeCat) {
      list = list.filter((e) => e.subtitle === activeCat);
    }

    // sort
    list.sort((a, b) => {
      switch (sort) {
        case "newest": {
          const aNum = parseInt(a.id.replace("ev-", ""), 10);
          const bNum = parseInt(b.id.replace("ev-", ""), 10);
          return bNum - aNum;
        }
        case "soonest": {
          const aTime = new Date(a.rawDate).getTime();
          const bTime = new Date(b.rawDate).getTime();
          // future first, past last
          const aFut = aTime >= now.getTime() ? 0 : 1;
          const bFut = bTime >= now.getTime() ? 0 : 1;
          if (aFut !== bFut) return aFut - bFut;
          return aTime - bTime;
        }
        case "priceAsc":
          return (a.price ?? 0) - (b.price ?? 0);
        case "priceDesc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "fillRatio":
          return (b.fillRatio ?? 0) - (a.fillRatio ?? 0);
        default:
          return 0;
      }
    });

    return list;
  }, [allEvents, search, activeCat, sort, now]);

  return (
    <div className={styles.wrapper}>
      {/* search + sort row */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="ค้นหากิจกรรม…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className={styles.clearBtn}
              onClick={() => setSearch("")}
              aria-label="ล้างค้นหา"
            >
              ×
            </button>
          )}
        </div>

        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          {SORT_LABELS.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* category chips */}
      <div className={styles.chips}>
        <button
          className={`${styles.chip} ${activeCat === null ? styles.chipActive : ""}`}
          onClick={() => setActiveCat(null)}
        >
          ทั้งหมด
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${activeCat === cat ? styles.chipActive : ""}`}
            onClick={() => setActiveCat(activeCat === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* count */}
      <p className={styles.count}>
        {filtered.length === 0
          ? "ไม่พบกิจกรรม"
          : `พบ ${filtered.length} กิจกรรม`}
      </p>

      {/* grid */}
      {filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((event) => (
            <a
              key={event.id}
              className={styles.card}
              href={`/events/${event.id}`}
            >
              <div
                className={styles.poster}
                style={
                  event.image
                    ? {
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background: `linear-gradient(150deg, ${event.gradient[0]}, ${event.gradient[1]})`,
                      }
                }
              >
                <span className={styles.sheen} aria-hidden="true" />
                {event.soldOut && (
                  <span className={styles.soldOut}>SOLD OUT</span>
                )}
                <div className={styles.posterText}>
                  <strong className={styles.posterTitle}>
                    {event.title}
                  </strong>
                  <span className={styles.posterSub}>{event.subtitle}</span>
                  <span className={styles.posterDate}>{event.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
