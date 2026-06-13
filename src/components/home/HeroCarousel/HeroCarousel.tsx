"use client";

import { useState, useEffect, useCallback } from "react";
import { HERO_SLIDES } from "../homeData";
import styles from "./HeroCarousel.module.scss";

const AUTOPLAY_MS = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    setIndex(((next % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, paused, goTo]);

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="โปรโมชันเด่น"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${i === index ? styles.slideActive : ""}`}
              style={{ background: `linear-gradient(115deg, ${slide.gradient[0]}, ${slide.gradient[1]})` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} จาก ${HERO_SLIDES.length}`}
              aria-hidden={i !== index}
            >
              <div className={styles.mesh} aria-hidden="true" />
              <div className={styles.copy}>
                <span className={styles.eyebrow}>{slide.eyebrow}</span>
                <h2 className={styles.heroTitle}>
                  {slide.title.split("\n").map((line, li) => (
                    <span key={li} className={styles.heroLine}>
                      {line}
                    </span>
                  ))}
                  <span className={styles.highlight}>{slide.highlight}</span>
                </h2>
              </div>
              <span className={styles.plus} aria-hidden="true">
                +
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots} role="tablist" aria-label="เลือกสไลด์">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={`สไลด์ ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
