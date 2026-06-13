import { notFound } from "next/navigation";
import { getPosterById } from "@/components/home/homeData";
import EventStarField from "@/components/eventDetail/EventStarField";
import EventPoster from "@/components/eventDetail/EventPoster";
import EventHeroInfo from "@/components/eventDetail/EventHeroInfo";
import EventDetailCard from "@/components/eventDetail/EventDetailCard";
import EventStageSection from "@/components/eventDetail/EventDetailSection";
import { SameEvent } from "@/components/sameEvent/SameEvent";
import { Footer } from "@/components/footer/Footer";
import styles from "./page.module.scss";

const DESCRIPTION =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
  "when an unknown printer took a galley of type and scrambled it to make a type " +
  "specimen book. It has survived not only five centuries, but also the leap into " +
  "electronic typesetting, remaining essentially unchanged.";

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
        <EventStarField />

        <div className={styles.heroInner}>
          <h1 className={styles.title}>{event.title}</h1>

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

      <SameEvent />
      <Footer />
    </div>
  );
}