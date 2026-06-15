"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { simulationStore } from "@/lib/simulation-store";
import styles from "./LiveOrderFeed.module.scss";

const AUTO_DISMISS_MS = 6000;
const PRUNE_INTERVAL_MS = 1000;
const MAX_CARDS = 3;

function formatBaht(n: number): string {
  return n === 0 ? "ฟรี" : `฿${n.toLocaleString("th-TH")}`;
}

export default function LiveOrderFeed() {
  const liveSnap = useSyncExternalStore(
    simulationStore.subscribe,
    simulationStore.getSnapshot,
    simulationStore.getServerSnapshot,
  );

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
  useEffect(() => setMounted(true), []);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), PRUNE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("feed-collapsed") === "true";
    } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem("feed-collapsed", String(collapsed)); } catch {}
  }, [collapsed]);

  if (!mounted) return null;

  const snap = liveSnap;
  const visible = snap.orders.filter((o) => now - o.at < AUTO_DISMISS_MS).slice(0, MAX_CARDS);

  if (collapsed) {
    return (
      <div className={styles.feed}>
        <button
          type="button"
          className={styles.expandBtn}
          onClick={() => setCollapsed(false)}
          aria-label="ขยาย"
          title="ขยาย"
        >
          △
        </button>
      </div>
    );
  }

  return (
    <div className={styles.feed} aria-live="polite" aria-label="ออเดอร์เรียลไทม์">
      <div className={styles.cards}>
          {visible.map((o) => (
            <div key={o.id} className={styles.card}>
              <span className={styles.ticket}>🎟️</span>
              <div className={styles.info}>
                <strong className={styles.title}>{o.title}</strong>
                <span className={styles.meta}>
                  {o.buyer} · โซน {o.zone} · {formatBaht(o.price)}
                </span>
                <span className={styles.loc}>
                  {o.location} · {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      <div className={styles.statusBar}>
        <span className={`${styles.pill} ${snap.paused ? styles.pillPaused : ""}`}>
          <span className={styles.dot} />
          {snap.paused ? "หยุด" : "LIVE"}
        </span>

        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={snap.speed}
          onChange={(e) => simulationStore.setSpeed(Number(e.target.value))}
          className={styles.speedSlider}
          aria-label="ความเร็วจำลอง"
        />
        <span className={styles.speedLabel}>{snap.speed}x</span>

        <div className={styles.stats}>
          <span>{snap.totalTickets.toLocaleString("th-TH")} ใบ</span>
          <span className={styles.sep}>·</span>
          <span>{formatBaht(snap.revenue)}</span>
        </div>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => simulationStore.setPaused(!snap.paused)}
          aria-label={snap.paused ? "เริ่ม" : "หยุด"}
          title={snap.paused ? "เริ่ม" : "หยุด"}
        >
          {snap.paused ? "▶" : "❚❚"}
        </button>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setCollapsed(true)}
          aria-label="ย่อ"
          title="ย่อ"
        >
          △
        </button>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => simulationStore.reset()}
          aria-label="รีเซ็ต"
          title="รีเซ็ต"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
