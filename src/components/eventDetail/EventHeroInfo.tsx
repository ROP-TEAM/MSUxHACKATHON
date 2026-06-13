import styles from "./EventHeroInfo.module.scss";

type Props = {
  description: string;
};

export default function EventHeroInfo({ description }: Props) {
  return (
    <div className={styles.darkInfo}>
      <div className={styles.actions}>
        <button type="button" className={styles.followBtn}>
          ติดตาม
        </button>
        <span className={styles.tag}>
          <span className={styles.tagDot} aria-hidden="true" />
          มาแรง
        </span>
        <span className={styles.tag}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 13L8 8L11 11L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 5H15V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ชวนเพื่อน
        </span>
      </div>

      <p className={styles.description}>{description}</p>
    </div>
  );
}
