import Image from "next/image";
import styles from "./SameEvent.module.scss";
import eventsData from "@/data/events.json";

type EventData = {
  event_id: string;
  title: string;
  date: string;
  location: string;
  ticket_price: number;
};

type SlideCardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

type SameEventProps = {
  currentEventId?: string;
};

// path รูปเดิมตาม mock (เรียงตามลำดับ index)
const cardImages = [
  "/image/card1.jpg",
  "/image/card2.png",
  "/image/card3.jpg",
  "/image/card4.png",
  "/image/card5.png",
];

// ตัดปี (เช่น 2026, 2027) ออกจากชื่องาน เพื่อใช้เทียบหมวดหมู่
// "Book Launch 2026" -> "Book Launch"
const getCategory = (title: string) => title.replace(/\s?\d{4}$/, "").trim();

// หางานที่เกี่ยวข้องกับ currentEventId
// เกณฑ์: หมวดหมู่เดียวกัน (ชื่องานตัดปี) หรือ สถานที่จัดงานเดียวกัน ไม่รวมตัวเอง
// ถ้าได้ไม่ครบตามจำนวนรูปที่มี ให้เติมงานอื่นที่เหลือเข้ามาเรื่อยๆ
const getRelatedEvents = (currentEventId?: string): EventData[] => {
  const events = eventsData as EventData[];
  const current = events.find((e) => e.event_id === currentEventId);

  // ถ้าไม่พบงานปัจจุบัน (เช่น id ไม่ตรงรูปแบบ event_id) ให้แสดง 5 งานแรกแทน
  if (!current) {
    return events.slice(0, cardImages.length);
  }

  const currentCategory = getCategory(current.title);

  const related = events.filter(
    (e) =>
      e.event_id !== current.event_id &&
      (getCategory(e.title) === currentCategory ||
        e.location === current.location),
  );

  if (related.length < cardImages.length) {
    const remaining = events.filter(
      (e) =>
        e.event_id !== current.event_id &&
        !related.some((r) => r.event_id === e.event_id),
    );
    related.push(...remaining);
  }

  return related.slice(0, cardImages.length);
};

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

export const SameEvent = ({ currentEventId }: SameEventProps) => {
  const relatedEvents = getRelatedEvents(currentEventId);

  const cardData: SlideCardProps[] = relatedEvents.map((event, index) => ({
    title: event.location,
    description: event.title,
    imageUrl: cardImages[index],
  }));

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
        {cardData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};