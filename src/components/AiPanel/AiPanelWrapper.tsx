"use client";

import { useState } from "react";
import AiPanel from "./AiPanel";
import styles from "./AiPanelWrapper.module.scss";

type Role = "user" | "admin";

export default function AiPanelWrapper() {
  const [role, setRole] = useState<Role>("user");

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${role === "user" ? styles.active : ""}`}
          onClick={() => setRole("user")}
        >
          👤 ผู้ใช้ทั่วไป
        </button>
        <button
          className={`${styles.tab} ${role === "admin" ? styles.activeAdmin : ""}`}
          onClick={() => setRole("admin")}
        >
          ⬡ แอดมิน
        </button>
      </div>
      <AiPanel role={role} />
    </div>
  );
}
