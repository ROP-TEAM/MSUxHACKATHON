import styles from "./AnnouncementBar.module.scss";

export default function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {/* CTA pill */}
        <a className={styles.cta} href="/events">
          <span className={styles.spark} aria-hidden="true">✦</span>
          จองตั๋วง่ายด้วย AI Matching
        </a>

        {/* icons + hashtag + tagline */}
        <div className={styles.mid}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="10.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="2.5" y="10.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="11" y="11" width="4" height="4" rx="0.5" fill="currentColor" />
            </svg>
          </span>
          <span className={styles.icon} aria-hidden="true">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M3 4.5h14a0 0 0 0 1 0 0v2.2a1.7 1.7 0 0 0 0 3.4v2.4a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0v-2.4a1.7 1.7 0 0 0 0-3.4V4.5Z"
                stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
              />
            </svg>
          </span>
          <strong className={styles.hash}>#ไม่พลาดเทรนด์</strong>
          <div className={styles.taglineBlock}>
            <span className={styles.tagline}>เพราะทุกช่วงเวลามีความหมาย</span>
            <span className={styles.taglineSub}>ไม่พลาดทุกโอกาสใหม่ๆ</span>
          </div>
        </div>

        {/* brand */}
        <div className={styles.right}>
          <span className={styles.sep} aria-hidden="true" />
          <div className={styles.brandBlock}>
            <strong className={styles.brand}>MSUxHackathon</strong>
            <span className={styles.brandSub}>ตัวเต็งขอนแก่น #วิศวคอมมข.ดิวะ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
