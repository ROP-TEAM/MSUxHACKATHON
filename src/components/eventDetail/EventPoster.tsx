import Image from "next/image";
import styles from "./EventPoster.module.scss";

type Props = {
  title: string;
  image?: string;
  gradient: [string, string];
  soldOut?: boolean;
};

export default function EventPoster({ title, image, gradient, soldOut }: Props) {
  return (
    <div className={styles.posterCol}>
      <div className={styles.poster}>
        {image ? (
          <Image src={image} alt={title} fill sizes="380px" className={styles.posterImg} priority />
        ) : (
          <div
            className={styles.posterFallback}
            style={{ background: `linear-gradient(150deg, ${gradient[0]}, ${gradient[1]})` }}
          />
        )}
        {soldOut && <span className={styles.soldOut}>SOLD OUT</span>}
      </div>
    </div>
  );
}
