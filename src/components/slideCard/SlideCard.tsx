"use client";
import Image from "next/image";
import styles from "./SlideCard.module.scss";
import { useEffect, useRef, useState } from "react";
import eventsData from "@/data/events.json";
import ticketsData from "@/data/event_tickets.json";

type EventData = {
  event_id: string;
  title: string;
  date: string;
  location: string;
  ticket_price: number;
};

type TicketData = {
  ticket_id: string;
  user_id: string;
  event_id: string;
  seat_zone: string;
  status: string;
};

type SlideCardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

// แปลงวันที่เป็นรูปแบบภาษาไทย เช่น "27 มีนาคม 2569"
const formatEventDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// แปลงราคาตั๋ว
const formatPrice = (price: number) =>
  price === 0
    ? "เข้าฟรีไม่มีค่าใช้จ่าย"
    : `เริ่มต้นเพียง ${price.toLocaleString("th-TH")} บาท`;

// path รูปเดิมตาม mock (เรียงตามลำดับ index)
const cardImages = [
  "/image/card1.jpg",
  "/image/card2.png",
  "/image/card3.jpg",
  "/image/card4.png",
  "/image/card5.png",
];

// นับจำนวนตั๋วที่ถูกจองของแต่ละ event (รวมทุก status)
const ticketCountMap = (ticketsData as TicketData[]).reduce<
  Record<string, number>
>((acc, ticket) => {
  acc[ticket.event_id] = (acc[ticket.event_id] || 0) + 1;
  return acc;
}, {});

// สร้าง description แบบยาวขึ้น รวมสถานที่ วันที่ ราคา และจำนวนผู้จอง
const buildDescription = (event: EventData) => {
  const bookedCount = ticketCountMap[event.event_id] || 0;
  return `จัดที่ ${event.location} วันที่ ${formatEventDate(event.date)} มีผู้จองตั๋วเข้าร่วมแล้วกว่า ${bookedCount} ที่นั่ง ${formatPrice(event.ticket_price)} `;
};

// "ติดเทรนด์" = งานที่มีคนจองตั๋วเข้าเยอะที่สุด
// เรียงตามจำนวนตั๋วจากมากไปน้อย แล้วหยิบมาตามจำนวนรูปที่มี (5 อันดับแรก)
const slideData: SlideCardProps[] = [...(eventsData as EventData[])]
  .sort(
    (a, b) =>
      (ticketCountMap[b.event_id] || 0) - (ticketCountMap[a.event_id] || 0),
  )
  .slice(0, cardImages.length)
  .map((event, index) => ({
    title: event.title,
    description: buildDescription(event),
    imageUrl: cardImages[index],
  }));

export const SlideCard = ({ title, description, imageUrl }: SlideCardProps) => {
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
      {/* ใส่ suppressHydrationWarning ตรงนี้เพื่อแก้ Error เรื่อง Date ไม่ตรงกัน */}
      <p suppressHydrationWarning>{description}</p>
    </div>
  );
};

// นำ SlideList กลับมา Export เพื่อให้ page.tsx เรียกใช้ได้
export const SlideList = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false); // เช็คว่าเรนเดอร์บน Client แล้วหรือยัง
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false); // เริ่มต้นเป็น false ไว้ก่อน

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    setIsMounted(true); // ยืนยันว่าฝั่ง Client โหลดเสร็จแล้ว
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
      {/* แสดงลูกศรเมื่อ isMounted เป็น true เท่านั้น เพื่อแก้ Hydration Error */}
      {isMounted && canScrollLeft && (
        <div
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={scrollLeft}
        >
          <Image src="/icon/left.svg" alt="left" width={24} height={24} />
        </div>
      )}

      {isMounted && canScrollRight && (
        <div
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={scrollRight}
        >
          <Image src="/icon/right.svg" alt="right" width={24} height={24} />
        </div>
      )}

      {/* เปลี่ยนกลับมาใช้ fill ตามที่ปรับแก้ไป */}
      <Image src="/image/background.svg" alt="" fill className={styles.bg} />

      <div className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/icon/ticket.svg"
            alt="Ticket Icon"
            width={40}
            height={40}
          />
        </div>
        <p>มาแรงติดเทรนด์</p>
      </div>

      <div className={styles.slideContainer} ref={containerRef}>
        {slideData.map((slide, index) => (
          <SlideCard key={index} {...slide} />
        ))}
      </div>
    </div>
  );
};
