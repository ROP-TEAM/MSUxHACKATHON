import Image from "next/image";
import styles from "./SameEvent.module.scss";

const CardMockData: SlideCardProps[] = [
  {
    title: "MCC HALL",
    description:
      "Ticket to Heaven Fan Party",
    imageUrl: "/image/card1.jpg",
  },
  {
    title: "หอประชุมกองทัพอากาศ",
    description:
      "เหมันต์ตะวันรอน",
    imageUrl: "/image/card2.png",
  },
  {
    title: "MCC HALL",
    description: "WU DESTINY FAN PARTY",
    imageUrl: "/image/card3.jpg",
  },
  {
    title: "อิมแพ็ค อารีน่า",
    description: "F✦FOREVER 1st World",
    imageUrl: "/image/card4.png",
  },{
    title: "อาคารหอประชุมเมืองไทยประกันชีวิต",
    description: "PANTOMIME IN BANGKOK",
    imageUrl: "/image/card5.png",
  },
];

const Card = ({ title, description, imageUrl }: SlideCardProps) => {
  return (
    <div className={styles.card}>
      <Image
        src={imageUrl}
        alt={title}
        width={700}
        height={250}
        style={{
          width: "230px",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <h4>{description}</h4>
      <p>{title}</p>
    </div>
  );
};

export const SameEvent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/icon/logo1.svg"
            alt="Ticket Icon"
            width={40}
            height={40}
          />
        </div>
        <p>Related events</p>
      </div>
      <div className={styles.cardContainer}>
        {CardMockData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};
