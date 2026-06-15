"use client";

import { useState } from "react";
import Image from "next/image";
import AiPanel from "./AiPanel";
import styles from "./AiPanelWrapper.module.scss";

type Role = "user" | "admin";

type Props = { onClose?: () => void };

export default function AiPanelWrapper({ onClose }: Props) {
  const [role, setRole] = useState<Role>("user");

  return (
    <div className={styles.wrapper}>
      <div className={styles.topbar}>
        <div className={styles.brand}>
          <Image src="/logo/msuLogo.svg" alt="" width={16} height={20} />
          <span className={styles.brandLetter}>A</span>
        </div>
        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="ปิด"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${role === "user" ? styles.active : ""}`}
          onClick={() => setRole("user")}
        >
          ผู้ใช้ทั่วไป
        </button>
        <button
          className={`${styles.tab} ${role === "admin" ? styles.active : ""}`}
          onClick={() => setRole("admin")}
        >
          แอดมิน
        </button>
      </div>

      <AiPanel role={role} onClose={onClose} />
    </div>
  );
}
