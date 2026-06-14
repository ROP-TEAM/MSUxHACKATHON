"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { NEWS } from "../homeStaticData";
import styles from "./NewsSection.module.scss";

export default function NewsSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const { scrollLeft, scrollWidth, clientWidth } = rail;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  function scrollBy(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6 10.5l2.5 2.5L14 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className={styles.title}>มาแรงติดเทรนด์</h2>
        </header>

        <div className={styles.railWrap}>
          <button
            className={`${styles.nav} ${styles.navPrev} ${canPrev ? "" : styles.navHidden}`}
            onClick={() => scrollBy(-1)}
            aria-label="ดูข่าวก่อนหน้า"
            tabIndex={canPrev ? 0 : -1}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.rail} ref={railRef} onScroll={updateArrows}>
            {NEWS.map((item) => (
              <article className={styles.card} key={item.id}>
                <div
                  className={styles.thumb}
                  style={{ background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})` }}
                >
                  <span className={`${styles.badge} ${item.badge.tone === "hot" ? styles.badgeHot : ""}`}>
                    {item.badge.label}
                  </span>
                </div>
                <div className={styles.body}>
                  <p className={styles.headline}>{item.headline}</p>
                  <span className={styles.source}>{item.source}</span>
                </div>
              </article>
            ))}
          </div>

          <button
            className={`${styles.nav} ${styles.navNext} ${canNext ? "" : styles.navHidden}`}
            onClick={() => scrollBy(1)}
            aria-label="ดูข่าวถัดไป"
            tabIndex={canNext ? 0 : -1}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
