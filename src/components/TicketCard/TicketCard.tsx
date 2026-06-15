"use client";

import Image from "next/image";
import IconSvgMono from "@/components/icon/SvgIcon";
import styles from "./TicketCard.module.scss";
import type { TicketRow, TicketStatus } from "@/lib/simulation-store";

const STATUS_LABEL: Record<TicketStatus, string> = {
  PAID: "PAID",
  RESERVED: "RESERVED",
  USED: "USED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

const formatTicketDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
};

interface TicketCardProps {
  ticket: TicketRow;
  /** Optional hero image; falls back to a sky placeholder when absent. */
  image?: string;
  /** Bigger typography/stub for the modal view. */
  variant?: "list" | "modal";
  onClick?: () => void;
}

// Deterministic 16-digit serial from the ticket id (matches the PNG style).
const toSerial = (id: string): string => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return String(h).padStart(16, "0").slice(0, 16);
};

const TicketCard = ({ ticket, image, variant = "list", onClick }: TicketCardProps) => {
  const heroSrc = image ?? ticket.image;
  const statusColor = ticket.color || "#1f2937";
  const serial = toSerial(ticket.id);

  return (
    <div
      className={`${styles.ticket} ${variant === "modal" ? styles.modal : ""} ${
        onClick ? styles.clickable : ""
      }`}
      onClick={onClick}
    >
      <div className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            {heroSrc ? (
              <Image
                className={styles.heroImg}
                src={heroSrc}
                alt={ticket.eventTitle}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
              />
            ) : (
              <span className={styles.heroPlaceholder}>{ticket.eventTitle}</span>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div className={`${styles.field} ${styles.fieldStatus}`}>
            <span className={styles.label}>Status</span>
            <span className={styles.statusValue} style={{ color: statusColor }}>
              {STATUS_LABEL[ticket.status] ?? ticket.status}
            </span>
          </div>

          <div className={`${styles.field} ${styles.fieldEvent}`}>
            <span className={styles.label}>Event</span>
            <span className={styles.value}>{ticket.eventTitle}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Place</span>
            <span className={styles.value}>{ticket.location}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Date</span>
            <span className={styles.value}>{formatTicketDate(ticket.date)}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Seat</span>
            <span className={styles.value}>{ticket.seat}</span>
          </div>
        </div>
      </div>

      <div className={styles.stub}>
        <span className={styles.stubText}>
          Norma Zone · {ticket.seat} · {ticket.id}
        </span>
        <span className={styles.brand}>
          <IconSvgMono
            className={styles.brandGlyph}
            src="/icon/logoTicket.svg"
            width={11}
            height={11}
            alt="ticket"
            fixColor
          />
          Tiket
        </span>
        <span className={styles.serial}>{serial}</span>
        <div className={styles.barcode} />
      </div>
    </div>
  );
};

export default TicketCard;
