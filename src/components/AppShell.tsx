"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import AiPanelWrapper from "./AiPanel/AiPanelWrapper";
import styles from "./AppShell.module.scss";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
      <Navbar onAiToggle={toggleAi} aiOpen={aiOpen} />
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
          aria-hidden={!aiOpen}
          tabIndex={aiOpen ? 0 : -1}
        >
          <AiPanelWrapper />
        </div>
      </div>
    </div>
  );
}
