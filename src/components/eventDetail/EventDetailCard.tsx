import styles from "./EventDetailCard.module.scss";

type Props = {
  subtitle: string;
  date: string;
  venue: string;
  price: number;
  soldOut?: boolean;
};

export default function EventDetailCard({ subtitle, date, venue, price, soldOut }: Props) {
  return (
    <div className={styles.detail}>
      <div className={styles.detailHead}>
        <h2 className={styles.detailName}>{subtitle}</h2>
        <span className={`${styles.status} ${soldOut ? styles.statusSold : styles.statusOpen}`}>
          {soldOut ? "ขายหมด" : "เปิดขาย"}
        </span>
      </div>

      <div className={styles.detailMid}>
        <ul className={styles.meta}>
          <li className={styles.metaRow}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 8H17M7 3V6M13 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{date}</span>
          </li>
          <li className={styles.metaRow}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 17C10 17 16 12.5 16 8.5C16 5.46 13.31 3 10 3C6.69 3 4 5.46 4 8.5C4 12.5 10 17 10 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>{venue}</span>
          </li>
        </ul>

        <span className={styles.price}>
          {price.toLocaleString("th-TH")} <span className={styles.priceUnit}>บาท</span>
        </span>
      </div>

      <div className={styles.purchaseRow}>
        <button type="button" className={styles.favBtn} aria-label="บันทึกรายการโปรด">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M11 19C11 19 3 14.5 3 8.8C3 6.15 5.1 4 7.7 4C9.2 4 10.5 4.8 11 6C11.5 4.8 12.8 4 14.3 4C16.9 4 19 6.15 19 8.8C19 14.5 11 19 11 19Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={styles.buyBtn} disabled={soldOut}>
          {soldOut ? "ขายหมดแล้ว" : "ซื้อบัตร!"}
        </button>
      </div>
    </div>
  );
}
