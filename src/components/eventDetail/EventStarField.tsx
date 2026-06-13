import styles from "./EventStarField.module.scss";

const STARS: { top: string; left: string; size: number; opacity: number; rotate: number }[] = [
  { top: "-4%", left: "-3%", size: 170, opacity: 0.85, rotate: -12 },
  { top: "30%", left: "1%", size: 130, opacity: 0.7, rotate: 10 },
  { top: "62%", left: "7%", size: 90, opacity: 0.6, rotate: 22 },
  { top: "-6%", left: "84%", size: 190, opacity: 0.85, rotate: 14 },
  { top: "32%", left: "90%", size: 240, opacity: 0.5, rotate: -8 },
  { top: "66%", left: "82%", size: 110, opacity: 0.7, rotate: -18 },
];

export default function EventStarField() {
  return (
    <div className={styles.stars} aria-hidden="true">
      {STARS.map((star, i) => (
        <span
          key={i}
          className={styles.star}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            transform: `rotate(${star.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
