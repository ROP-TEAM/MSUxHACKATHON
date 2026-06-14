"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "./Navbar/Navbar";
import AiPanelWrapper from "./AiPanel/AiPanelWrapper";
import styles from "./AppShell.module.scss";

// Client-only: reads sessionStorage + runs timers. No SSR → no hydration mismatch.
const LiveOrderFeed = dynamic(() => import("./realtime/LiveOrderFeed"), { ssr: false });

type NavKey = "home" | "concerts" | "all-events" | "my-tickets" | "overview" | "contact";

function getActiveKey(pathname: string): NavKey {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/events")) return "all-events";
  if (pathname.startsWith("/tickets")) return "my-tickets";
  if (pathname.startsWith("/overview")) return "overview";
  if (pathname.startsWith("/contact")) return "contact";
  return "home";
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  function toggleAi() {
    setAiOpen((prev) => {
      if (!prev) {
        // Opening — focus panel after transition
        setTimeout(() => panelRef.current?.focus(), 350);
      }
      return !prev;
    });
  }

  function closeAi() {
    setAiOpen(false);
    // Return focus to trigger
    setTimeout(() => triggerRef.current?.focus(), 50);
  }

  // Close on Escape
  useEffect(() => {
    if (!aiOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAi();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [aiOpen]);

  return (
    <div className={styles.appShell}>
      <Navbar onAiToggle={toggleAi} aiOpen={aiOpen} activeKey={getActiveKey(pathname)} />
      <div className={styles.content}>
        <main className={styles.main}>
          {children}
        </main>
        {aiOpen && (
          <div className={styles.panelOverlay} onClick={closeAi} aria-hidden="true" />
        )}
        <div
          ref={panelRef}
          className={`${styles.panel} ${aiOpen ? styles.panelOpen : ""}`}
          aria-hidden={aiOpen ? "false" : "true"}
          tabIndex={aiOpen ? 0 : -1}
        >
          <AiPanelWrapper onClose={closeAi} />
        </div>
      </div>
      <LiveOrderFeed />
    </div>
  );
}
