'use client';
import Image from "next/image";
import styles from "./SlideCard.module.scss";
import { useEffect, useRef, useState } from "react";

const slideMockData: SlideCardProps[] = [
  {
    title: "Exclusive",
    description:
      "Ticket to Heaven Fan Party บนช่องทาง Online  วันเสาร์ที่ 20 มิถุนายน 2569 เริ่มเวลา 10:00 น.",
    imageUrl: "/image/card1.jpg",
  },
  {
    title: "Actor",
    description:
      "ตามรอย เหมันต์ตะวันรอน เตรียมออกเดินทางสู่ รังเสือตะวัน และสัมผัสบรรยากาศจริงจากละคร",
    imageUrl: "/image/card2.png",
  },
  {
    title: "Actor",
    description: "WU DESTINY FAN PARTY และ WU DESTINY AFTER PARTY",
    imageUrl: "/image/card3.jpg",
  },
  {
    title: "Exclusive",
    description: "F✦FOREVER 1st World Tour in Bangkok ระบุชื่อบนบัตรได้เพียง 1 ใบต่อรอบการแสดง",
    imageUrl: "/image/card4.png",
  },{
    title: "Actor",
    description: "PANTOMIME IN BANGKOK 18 เทศกาลบริหารจินตนาการที่ทุกคนคิดถึง Pantomime in Bangkok",
    imageUrl: "/image/card5.png",
  },
];

const SlideCard = ({ title, description, imageUrl }: SlideCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <h3>{title}</h3>
      </div>
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={250}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />
      <p>{description}</p>
    </div>
  );
};

export const SlideList = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 1 // -1 กัน rounding error
    );
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className={styles.backgroundImage}>
      {canScrollLeft && (
  <div
    className={`${styles.arrow} ${styles.arrowLeft}`}
    onClick={scrollLeft}
  >
    <Image
      src="/icon/left.svg"
      alt="left"
      width={24}
      height={24}
    />
  </div>
)}
      {canScrollRight && (
  <div
    className={`${styles.arrow} ${styles.arrowRight}`}
    onClick={scrollRight}
  >
    <Image
      src="/icon/right.svg"
      alt="right"
      width={24}
      height={24}
    />
  </div>
)}

      <Image src="/image/background.svg" alt="" fill />

      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src="/icon/ticket.svg" alt="Ticket Icon" width={40} height={40} />
        </div>
        <p>Trending Now</p>
      </div>

      <div className={styles.slideContainer} ref={containerRef}>
        {slideMockData.map((slide, index) => (
          <SlideCard key={index} {...slide} />
        ))}
      </div>
    </div>
  );
};