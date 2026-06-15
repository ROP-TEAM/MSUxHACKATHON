"use client";

import { use, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./detail.module.scss";
import { simulationStore, STATUS_CONFIG } from "@/lib/simulation-store";
import { userStore } from "@/lib/user-store";
import type { TicketStatus } from "@/lib/simulation-store";

type Props = { params: Promise<{ ticketId: string }> };

export default function TicketDetailPage({ params }: Props) {
  const { ticketId } = use(params);
  const router = useRouter();

  const userId = useSyncExternalStore(
    userStore.subscribe,
    () => userStore.getCurrentUserId(),
    () => "u001",
  );

  const mergedTickets = useSyncExternalStore(
    simulationStore.subscribeMerged,
    () => simulationStore.getMergedSnapshot(),
    () => simulationStore.getMergedServerSnapshot(),
  );

  const ticket = mergedTickets.find((t) => t.id === ticketId && t.user_id === userId);

  if (!ticket) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>ไม่พบตั๋ว</h2>
          <p>ตั๋วใบนี้ไม่มีในระบบ หรือคุณไม่มีสิทธิ์เข้าถึง</p>
          <button className={styles.backBtn} onClick={() => router.push("/mytickets")}>
            กลับไปหน้าตั๋วของฉัน
          </button>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[ticket.status as TicketStatus] ?? {
    icon: "/icon/ticket1.svg",
    color: "#888888",
  };

  const statusLabel: Record<string, string> = {
    PAID: "ชำระแล้ว",
    RESERVED: "จองไว้",
    USED: "ใช้แล้ว",
    CANCELLED: "ยกเลิก",
    REFUNDED: "คืนเงิน",
  };

  function handleCancel() {
    simulationStore.cancelTicket(ticketId);
    router.push("/mytickets");
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleDownload() {
    // Mock — no actual ticket image beyond QR placeholder
    alert("ระบบจะดาวน์โหลด E-Ticket ในเวอร์ชันจริง");
  }

  return (
    <div className={styles.container}>
      <button className={styles.backLink} onClick={() => router.push("/mytickets")}>
        ← กลับไปตั๋วของฉัน
      </button>

      <div className={styles.ticketCard}>
        <div className={styles.topSection}>
          <div className={styles.headerInfo}>
            <Image src={cfg.icon} alt="" width={40} height={40} />
            <div>
              <h1>{ticket.eventTitle}</h1>
              <p className={styles.venue}>{ticket.location}</p>
            </div>
          </div>

          <span
            className={styles.statusBadge}
            style={{ background: cfg.color + "18", color: cfg.color }}
          >
            {statusLabel[ticket.status] ?? ticket.status}
          </span>
        </div>

        <div className={styles.divider} />

        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>ผู้ถือบัตร</span>
            <span className={styles.value}>{ticket.name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>วันที่จัดงาน</span>
            <span className={styles.value}>
              {new Date(ticket.date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>โซนที่นั่ง</span>
            <span className={styles.value}>Zone {ticket.seat}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>ราคา</span>
            <span className={styles.value}>฿{ticket.price.toLocaleString("th-TH")}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>หมายเลขตั๋ว</span>
            <span className={styles.value}>{ticket.id}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.qrSection}>
          <div className={styles.qrPlaceholder}>
            <span>QR CODE</span>
            <p>E-Ticket #{ticket.id}</p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handleDownload}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            ดาวน์โหลด
          </button>
          <button className={styles.actionBtn} onClick={handleShare}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            แชร์
          </button>

          {(ticket.status === "RESERVED" || ticket.status === "PAID") && (
            <button className={styles.cancelBtn} onClick={handleCancel}>
              ยกเลิกบัตร
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
