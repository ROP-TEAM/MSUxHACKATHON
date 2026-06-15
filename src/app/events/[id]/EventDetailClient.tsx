"use client";

import { useState, useSyncExternalStore } from "react";
import EventStarField from "@/components/eventDetail/EventStarField";
import EventPoster from "@/components/eventDetail/EventPoster";
import EventHeroInfo from "@/components/eventDetail/EventHeroInfo";
import EventDetailCard from "@/components/eventDetail/EventDetailCard";
import StageOverview from "@/components/StageOverview/StageOverview";
import { ZoneModal } from "@/components/zoneModal/ZoneModal";
import { SameEvent } from "@/components/sameEvent/SameEvent";
import { Footer } from "@/components/footer/footer";
import type { PosterEvent } from "@/components/home/homeData";
import { simulationStore, isEventSoldOut, EMPTY_ORDERS } from "@/lib/simulation-store";
import { userStore } from "@/lib/user-store";
import styles from "./page.module.scss";

type Props = {
  event: PosterEvent;
  eventId: string;
  description: string;
};

export default function EventDetailClient({ event, eventId, description }: Props) {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const userId = useSyncExternalStore(userStore.subscribe, () => userStore.getCurrentUserId(), () => "u001");

  // Live soldOut — combines real tickets + sim orders
  const orders = useSyncExternalStore(
    simulationStore.subscribe,
    () => simulationStore.getSnapshot().orders,
    () => EMPTY_ORDERS,
  );
  const simSoldOut = isEventSoldOut(eventId, orders);
  const liveSoldOut = event.soldOut || simSoldOut;

  const accent = event.accent ?? event.gradient[0];
  const venue = event.venue ?? "อิมแพค อารีน่า เมืองทองธานี";
  const price = event.price ?? 500;

  const openPurchase = () => setActiveZone("Standing");

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
              soldOut={liveSoldOut}
            />

            <div className={styles.body}>
              <EventHeroInfo description={description} />

              <EventDetailCard
                subtitle={event.subtitle}
                date={event.date}
                venue={venue}
                price={price}
                soldOut={liveSoldOut}
                onBuy={openPurchase}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.stage}>
          <StageOverview
            eventId={eventId}
            onZoneClick={(zoneId) => setActiveZone(zoneId)}
          />
        </div>
      </section>

      <ZoneModal
        isActive={activeZone !== null}
        onClose={() => setActiveZone(null)}
        zoneId={activeZone}
        eventId={eventId}
        eventTitle={event?.title ?? ""}
        eventDate={event.rawDate}
        userId={userId}
      />

      <SameEvent currentEventId={eventId} />
      <Footer />
    </div>
  );
}
