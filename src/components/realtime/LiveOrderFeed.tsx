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
  const snap = useSyncExternalStore(
    simulationStore.subscribe,
    simulationStore.getSnapshot,
    simulationStore.getServerSnapshot,
  );

  // Local clock so expired toasts fade out between store ticks.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), PRUNE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const visible = snap.orders.filter((o) => now - o.at < AUTO_DISMISS_MS);
  const fillPct =
    snap.totalCapacity > 0 ? Math.round((snap.totalSold / snap.totalCapacity) * 100) : 0;

  return (
    <div className={styles.feed} aria-live="polite" aria-label="ออเดอร์เรียลไทม์">
      <div className={styles.statusBar}>
        <span className={`${styles.pill} ${snap.paused ? styles.pillPaused : ""}`}>
          <span className={styles.dot} />
          {snap.paused ? "หยุดชั่วคราว" : "LIVE"}
        </span>
        <div className={styles.stats}>
          <span>{snap.soldToday.toLocaleString("th-TH")} ใบ</span>
          <span className={styles.sep}>·</span>
          <span>{formatBaht(snap.revenue)}</span>
          <span className={styles.sep}>·</span>
          <span>{fillPct}%</span>
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
              <strong className={styles.title}>{o.title}</strong>
              <span className={styles.meta}>
                โซน {o.zone} · {o.qty} ใบ · {formatBaht(o.total)}
              </span>
              <span className={styles.loc}>
                {o.location} · {o.remaining > 0 ? `เหลือ ${o.remaining} ที่` : "เต็มแล้ว"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
