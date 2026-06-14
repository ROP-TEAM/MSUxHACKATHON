"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { simulationStore } from "@/lib/simulation-store";
import styles from "./LiveOrderFeed.module.scss";

const AUTO_DISMISS_MS = 6000;
const PRUNE_INTERVAL_MS = 1000;

function formatBaht(n: number): string {
  return n === 0 ? "ฟรี" : `฿${n.toLocaleString("th-TH")}`;
}

export default function LiveOrderFeed() {
  const liveSnap = useSyncExternalStore(
    simulationStore.subscribe,
    simulationStore.getSnapshot,
    simulationStore.getServerSnapshot,
  );

  // Client-only widget (reads sessionStorage, ticks with timers). Render
  // nothing on the server / before mount so there is no SSR HTML to mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Local clock so expired toasts fade out between store ticks.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), PRUNE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const snap = liveSnap;
  const visible = snap.orders.filter((o) => now - o.at < AUTO_DISMISS_MS);

  return (
    <div className={styles.feed} aria-live="polite" aria-label="ออเดอร์เรียลไทม์">
      <div className={styles.statusBar}>
        <span className={`${styles.pill} ${snap.paused ? styles.pillPaused : ""}`}>
          <span className={styles.dot} />
          {snap.paused ? "หยุดชั่วคราว" : "LIVE"}
        </span>
        <div className={styles.stats}>
          <span style={{ color: "#ffffff" }}>{snap.totalTickets.toLocaleString("th-TH")} ใบ</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
          <span style={{ color: "#ffffff" }}>{formatBaht(snap.revenue)}</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
          <span style={{ color: "#34d399" }}>+{snap.added.toLocaleString("th-TH")} ใหม่</span>
        </div>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => simulationStore.setPaused(!snap.paused)}
          aria-label={snap.paused ? "เริ่มอัปเดต" : "หยุดอัปเดต"}
          title={snap.paused ? "เริ่มอัปเดต" : "หยุดอัปเดต"}
        >
          {snap.paused ? "▶" : "❚❚"}
        </button>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => simulationStore.reset()}
          aria-label="รีเซ็ตข้อมูลจำลอง"
          title="รีเซ็ต"
        >
          ↺
        </button>
      </div>

      <div className={styles.cards}>
        {visible.map((o) => (
          <div key={o.id} className={styles.card}>
            <span className={styles.ticket}>🎟️</span>
            <div className={styles.info}>
              <strong className={styles.title} style={{ color: "#ffffff" }}>{o.title}</strong>
              <span className={styles.meta} style={{ color: "#a5b4fc" }}>
                {o.buyer} · โซน {o.zone} · {formatBaht(o.price)}
              </span>
              <span className={styles.loc} style={{ color: "rgba(255,255,255,0.65)" }}>
                {o.location} · {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
