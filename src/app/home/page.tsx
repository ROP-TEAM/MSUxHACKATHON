import HeroCarousel from "@/components/home/HeroCarousel/HeroCarousel";
import AnnouncementBar from "@/components/home/AnnouncementBar/AnnouncementBar";
import EventSectionRow from "@/components/home/EventSectionRow/EventSectionRow";
import NearlyFullRow from "@/components/home/NearlyFullRow/NearlyFullRow";
import { SlideList } from "@/components/slideCard/SlideCard";
import { SECTIONS } from "@/components/home/homeData";
import styles from "./page.module.scss";

const Home = () => {
  return (
    <div className={styles.page}>
      <HeroCarousel />
      <AnnouncementBar />

      <div className={styles.eventsArea}>
        <NearlyFullRow />
        {SECTIONS.filter((section) => section.title !== "ใกล้เต็ม").map((section) => (
          <EventSectionRow
            key={section.title}
            title={section.title}
            events={section.events}
          />
        ))}
      </div>

      <div className={styles.newsHeaderRow}>
        <h2 className={styles.newsHeaderTitle}>ข่าวล่าสุด</h2>
        <a
          className={styles.newsHeaderLink}
          href="/news"
          aria-label="ดูข่าวทั้งหมด"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 13L13 5M13 5H6M13 5V12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <SlideList />
    </div>
  );
};

export default Home;
