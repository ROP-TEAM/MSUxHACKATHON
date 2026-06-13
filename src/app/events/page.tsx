import { Footer } from "@/components/footer/footer";
import { ALL_POSTERS, CATEGORY_SECTIONS } from "@/components/home/homeData";
import EventsPageClient from "./EventsPageClient";
import styles from "./page.module.scss";

const CATEGORIES = CATEGORY_SECTIONS.map((s) => s.title);

const EventsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero} />

      <div className={styles.eventsArea}>
        <EventsPageClient allEvents={ALL_POSTERS} categories={CATEGORIES} />
      </div>

      <Footer />
    </div>
  );
};

export default EventsPage;
