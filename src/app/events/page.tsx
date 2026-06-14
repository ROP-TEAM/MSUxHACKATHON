import { Suspense } from "react";
import { Footer } from "@/components/footer/footer";
import { ALL_POSTERS, CATEGORY_SECTIONS } from "@/components/home/homeData";
import EventsPageClient from "./EventsPageClient";
import styles from "./page.module.scss";
import Image from "next/image";

const CATEGORIES = CATEGORY_SECTIONS.map((s) => s.title);

function EventsPageInner() {
  return (
    <div className={styles.page}>
      <Image
              src="/image/background1.svg"
              alt="background"
              width={400}
              height={250}
              style={{
                width: "100%",
                height: "100%",
              }}/>

      <div className={styles.eventsArea}>
        <EventsPageClient allEvents={ALL_POSTERS} categories={CATEGORIES} />
      </div>

      <Footer />
    </div>
  );
}

const EventsPage = () => (
  <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
    <EventsPageInner />
  </Suspense>
);

export default EventsPage;
