import { notFound } from "next/navigation";
import { getPosterById } from "@/components/home/homeData";
import EventStarField from "@/components/eventDetail/EventStarField";
import EventPoster from "@/components/eventDetail/EventPoster";
import EventHeroInfo from "@/components/eventDetail/EventHeroInfo";
import EventDetailCard from "@/components/eventDetail/EventDetailCard";
import EventStageSection from "@/components/eventDetail/EventDetailSection";
import { SameEvent } from "@/components/sameEvent/SameEvent";
import { Footer } from "@/components/footer/footer";
import styles from "./page.module.scss";

const DESCRIPTION =
  "จองบัตรเข้าชมงานได้อย่างสะดวกและรวดเร็วผ่านระบบออนไลน์ เพียงเลือกโซนที่นั่งที่ต้องการ " +
  "ตรวจสอบราคาและจำนวนที่นั่งคงเหลือแบบเรียลไทม์ ก่อนดำเนินการชำระเงินผ่านช่องทางที่ปลอดภัย " +
  "หลังจากยืนยันการสั่งซื้อสำเร็จ ระบบจะจัดส่ง E-Ticket ไปยังอีเมลและบัญชีของท่านโดยอัตโนมัติ " +
  "สามารถนำบัตรอิเล็กทรอนิกส์ไปแสดงที่หน้างานเพื่อสแกนเข้าร่วมกิจกรรมได้ทันที " +
  "โดยไม่ต้องพิมพ์บัตรหรือต่อแถวรับบัตรล่วงหน้าให้เสียเวลา";

type Props = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = getPosterById(id);

  if (!event) notFound();

  const accent = event.accent ?? event.gradient[0];
  const venue = event.venue ?? "อิมแพค อารีน่า เมืองทองธานี";
  const price = event.price ?? 500;

  return (
    <div className={styles.page} style={{ ["--accent" as string]: accent }}>
      <section className={styles.hero}>
        <EventStarField gradient={event.gradient} />

        <div className={styles.heroInner}>
          <div className={styles.columns}>
            <EventPoster
              title={event.title}
              image={event.image}
              gradient={event.gradient}
              soldOut={event.soldOut}
            />

            <div className={styles.body}>
              <EventHeroInfo description={DESCRIPTION} />

              <EventDetailCard
                subtitle={event.subtitle}
                date={event.date}
                venue={venue}
                price={price}
                soldOut={event.soldOut}
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.container}>
        <div className={styles.stage}>
          <EventStageSection />
        </div>
      </section>

      <SameEvent currentEventId={id} />
      <Footer />
    </div>
  );
}