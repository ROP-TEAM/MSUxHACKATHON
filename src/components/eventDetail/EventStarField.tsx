import styles from "./EventStarField.module.scss";

const STARS: {
  top: string;
  left: string;
  size: number;
  rotate: number;
  flowAngle: number;
}[] = [
  { top: "25%", left: "-5%", size: 200, rotate: -45, flowAngle: 30 },
  { top: "75%", left: "-1%", size: 160, rotate: -15, flowAngle: 140 },
  { top: "-17%", left: "87%", size: 280, rotate: 14, flowAngle: 180 },
  { top: "60%", left: "90%", size: 240, rotate: -8, flowAngle: 60 },
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToString(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

function muteColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const keep = 0.6;
  const nr = Math.round(r * keep + 40 * (1 - keep));
  const ng = Math.round(g * keep + 40 * (1 - keep));
  const nb = Math.round(b * keep + 50 * (1 - keep));
  return rgbToString(nr, ng, nb);
}

function lerpColor(start: string, end: string, t: number): [number, number, number] {
  const [r1, g1, b1] = hexToRgb(start);
  const [r2, g2, b2] = hexToRgb(end);
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
}

type Props = {
  gradient: [string, string];
};

export default function EventStarField({ gradient }: Props) {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="star-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
            <feBlend in="grayNoise" in2="SourceGraphic" mode="multiply" result="grain" />
            <feComposite in="grain" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <div className={styles.stars} aria-hidden="true">
        {STARS.map((star, i) => {
          const t = STARS.length > 1 ? i / (STARS.length - 1) : 0;
          const [r, g, b] = lerpColor(gradient[0], gradient[1], t);
          const from = muteColor(gradient[0]);
          const to = muteColor(gradient[1]);
          const glow = rgbToString(r, g, b);

          return (
            <span
              key={i}
              className={styles.star}
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                transform: `rotate(${star.rotate}deg)`,
                background: `linear-gradient(${star.flowAngle}deg, ${from}, ${to})`,
                filter: `url(#star-noise) drop-shadow(0 0 2rem ${glow})`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
