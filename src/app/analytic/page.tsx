"use client";

import { Suspense, useState, useMemo } from "react";
import Image from "next/image";
import { Footer } from "@/components/footer/footer";
import styles from "./page.module.scss";
import TicketPieChart from "@/components/analytic/TicketPieChart";
import TicketBarChart from "@/components/analytic/TicketBarChart";

const ticketsData = [
  {
    ticket_id: "et-001",
    user_id: "u009",
    event_id: "ev-041",
    seat_zone: "D",
    status: "CANCELLED",
  },
  {
    ticket_id: "et-002",
    user_id: "u008",
    event_id: "ev-042",
    seat_zone: "B",
    status: "USED",
  },
  {
    ticket_id: "et-003",
    user_id: "u012",
    event_id: "ev-015",
    seat_zone: "D",
    status: "RESERVED",
  },
  {
    ticket_id: "et-004",
    user_id: "u006",
    event_id: "ev-039",
    seat_zone: "Regular",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-005",
    user_id: "u006",
    event_id: "ev-017",
    seat_zone: "C",
    status: "USED",
  },
  {
    ticket_id: "et-006",
    user_id: "u005",
    event_id: "ev-047",
    seat_zone: "B",
    status: "RESERVED",
  },
  {
    ticket_id: "et-007",
    user_id: "u003",
    event_id: "ev-048",
    seat_zone: "B",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-008",
    user_id: "u003",
    event_id: "ev-020",
    seat_zone: "D",
    status: "USED",
  },
  {
    ticket_id: "et-009",
    user_id: "u014",
    event_id: "ev-031",
    seat_zone: "Regular",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-010",
    user_id: "u013",
    event_id: "ev-001",
    seat_zone: "B",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-011",
    user_id: "u004",
    event_id: "ev-019",
    seat_zone: "C",
    status: "USED",
  },
  {
    ticket_id: "et-012",
    user_id: "u011",
    event_id: "ev-026",
    seat_zone: "Standing",
    status: "PAID",
  },
  {
    ticket_id: "et-013",
    user_id: "u004",
    event_id: "ev-042",
    seat_zone: "A",
    status: "RESERVED",
  },
  {
    ticket_id: "et-014",
    user_id: "u013",
    event_id: "ev-029",
    seat_zone: "B",
    status: "USED",
  },
  {
    ticket_id: "et-015",
    user_id: "u010",
    event_id: "ev-033",
    seat_zone: "Standing",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-016",
    user_id: "u001",
    event_id: "ev-020",
    seat_zone: "Regular",
    status: "RESERVED",
  },
  {
    ticket_id: "et-017",
    user_id: "u015",
    event_id: "ev-042",
    seat_zone: "Regular",
    status: "RESERVED",
  },
  {
    ticket_id: "et-018",
    user_id: "u002",
    event_id: "ev-020",
    seat_zone: "C",
    status: "CANCELLED",
  },
  {
    ticket_id: "et-019",
    user_id: "u006",
    event_id: "ev-028",
    seat_zone: "A",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-020",
    user_id: "u007",
    event_id: "ev-043",
    seat_zone: "D",
    status: "USED",
  },
  {
    ticket_id: "et-021",
    user_id: "u011",
    event_id: "ev-034",
    seat_zone: "A",
    status: "PAID",
  },
  {
    ticket_id: "et-022",
    user_id: "u006",
    event_id: "ev-010",
    seat_zone: "C",
    status: "RESERVED",
  },
  {
    ticket_id: "et-023",
    user_id: "u010",
    event_id: "ev-019",
    seat_zone: "A",
    status: "USED",
  },
  {
    ticket_id: "et-024",
    user_id: "u007",
    event_id: "ev-009",
    seat_zone: "C",
    status: "PAID",
  },
  {
    ticket_id: "et-025",
    user_id: "u005",
    event_id: "ev-037",
    seat_zone: "A",
    status: "PAID",
  },
  {
    ticket_id: "et-026",
    user_id: "u007",
    event_id: "ev-026",
    seat_zone: "B",
    status: "USED",
  },
  {
    ticket_id: "et-027",
    user_id: "u009",
    event_id: "ev-039",
    seat_zone: "Standing",
    status: "PAID",
  },
  {
    ticket_id: "et-028",
    user_id: "u006",
    event_id: "ev-043",
    seat_zone: "B",
    status: "USED",
  },
  {
    ticket_id: "et-029",
    user_id: "u013",
    event_id: "ev-003",
    seat_zone: "Standing",
    status: "PAID",
  },
  {
    ticket_id: "et-030",
    user_id: "u007",
    event_id: "ev-006",
    seat_zone: "Standing",
    status: "CANCELLED",
  },
  {
    ticket_id: "et-031",
    user_id: "u005",
    event_id: "ev-032",
    seat_zone: "B",
    status: "USED",
  },
  {
    ticket_id: "et-032",
    user_id: "u012",
    event_id: "ev-027",
    seat_zone: "D",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-033",
    user_id: "u012",
    event_id: "ev-034",
    seat_zone: "Standing",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-034",
    user_id: "u010",
    event_id: "ev-014",
    seat_zone: "B",
    status: "USED",
  },
  {
    ticket_id: "et-035",
    user_id: "u001",
    event_id: "ev-025",
    seat_zone: "C",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-036",
    user_id: "u005",
    event_id: "ev-007",
    seat_zone: "Standing",
    status: "PAID",
  },
  {
    ticket_id: "et-037",
    user_id: "u005",
    event_id: "ev-041",
    seat_zone: "D",
    status: "RESERVED",
  },
  {
    ticket_id: "et-038",
    user_id: "u002",
    event_id: "ev-033",
    seat_zone: "D",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-039",
    user_id: "u006",
    event_id: "ev-011",
    seat_zone: "Regular",
    status: "RESERVED",
  },
  {
    ticket_id: "et-040",
    user_id: "u003",
    event_id: "ev-019",
    seat_zone: "C",
    status: "RESERVED",
  },
  {
    ticket_id: "et-041",
    user_id: "u014",
    event_id: "ev-025",
    seat_zone: "B",
    status: "RESERVED",
  },
  {
    ticket_id: "et-042",
    user_id: "u013",
    event_id: "ev-044",
    seat_zone: "B",
    status: "REFUNDED",
  },
  {
    ticket_id: "et-043",
    user_id: "u012",
    event_id: "ev-012",
    seat_zone: "A",
    status: "USED",
  },
  {
    ticket_id: "et-044",
    user_id: "u014",
    event_id: "ev-019",
    seat_zone: "Standing",
    status: "USED",
  },
  {
    ticket_id: "et-045",
    user_id: "u015",
    event_id: "ev-031",
    seat_zone: "VIP",
    status: "PAID",
  },
  {
    ticket_id: "et-046",
    user_id: "u013",
    event_id: "ev-031",
    seat_zone: "VIP",
    status: "USED",
  },
  {
    ticket_id: "et-047",
    user_id: "u011",
    event_id: "ev-021",
    seat_zone: "Standing",
    status: "PAID",
  },
  {
    ticket_id: "et-048",
    user_id: "u012",
    event_id: "ev-037",
    seat_zone: "Standing",
    status: "USED",
  },
  {
    ticket_id: "et-049",
    user_id: "u006",
    event_id: "ev-049",
    seat_zone: "A",
    status: "PAID",
  },
  {
    ticket_id: "et-050",
    user_id: "u011",
    event_id: "ev-044",
    seat_zone: "D",
    status: "REFUNDED",
  },
];

const eventsData = [
  {
    event_id: "ev-001",
    title: "Art Exhibition 2026",
    date: "2026-03-27T00:00:00Z",
    location: "BITEC Bangna",
    ticket_price: 0,
  },
  {
    event_id: "ev-002",
    title: "Blockchain Expo 2026",
    date: "2026-12-30T00:00:00Z",
    location: "Impact Arena",
    ticket_price: 0,
  },
  {
    event_id: "ev-003",
    title: "Book Launch 2026",
    date: "2026-03-04T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 2500,
  },
  {
    event_id: "ev-004",
    title: "Yoga Retreat 2026",
    date: "2026-05-03T00:00:00Z",
    location: "Siam Paragon",
    ticket_price: 500,
  },
  {
    event_id: "ev-005",
    title: "Book Launch 2026",
    date: "2026-05-05T00:00:00Z",
    location: "Impact Arena",
    ticket_price: 100,
  },
  {
    event_id: "ev-006",
    title: "Book Launch 2026",
    date: "2026-11-19T00:00:00Z",
    location: "BITEC Bangna",
    ticket_price: 2500,
  },
  {
    event_id: "ev-007",
    title: "Pet Expo 2026",
    date: "2026-07-07T00:00:00Z",
    location: "Union Hall",
    ticket_price: 1500,
  },
  {
    event_id: "ev-008",
    title: "Startup Pitch 2026",
    date: "2027-02-17T00:00:00Z",
    location: "Central World",
    ticket_price: 5000,
  },
  {
    event_id: "ev-009",
    title: "Blockchain Expo 2026",
    date: "2026-07-29T00:00:00Z",
    location: "Phuket Convention Center",
    ticket_price: 0,
  },
  {
    event_id: "ev-010",
    title: "Charity Run 2026",
    date: "2026-12-28T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 2500,
  },
  {
    event_id: "ev-011",
    title: "Design Week 2026",
    date: "2027-02-02T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 990,
  },
  {
    event_id: "ev-012",
    title: "Tech Conference 2025",
    date: "2025-07-03T00:00:00Z",
    location: "True Digital Park",
    ticket_price: 100,
  },
  {
    event_id: "ev-013",
    title: "Book Launch 2026",
    date: "2026-07-11T00:00:00Z",
    location: "Central World",
    ticket_price: 5000,
  },
  {
    event_id: "ev-014",
    title: "Pet Expo 2025",
    date: "2025-03-12T00:00:00Z",
    location: "BITEC Bangna",
    ticket_price: 100,
  },
  {
    event_id: "ev-015",
    title: "Coding Bootcamp 2026",
    date: "2027-01-31T00:00:00Z",
    location: "Central World",
    ticket_price: 1500,
  },
  {
    event_id: "ev-016",
    title: "Yoga Retreat 2027",
    date: "2026-03-27T00:00:00Z",
    location: "True Digital Park",
    ticket_price: 100,
  },
  {
    event_id: "ev-017",
    title: "Startup Pitch 2025",
    date: "2025-09-09T00:00:00Z",
    location: "Union Hall",
    ticket_price: 990,
  },
  {
    event_id: "ev-018",
    title: "Book Launch 2025",
    date: "2025-07-27T00:00:00Z",
    location: "Impact Arena",
    ticket_price: 200,
  },
  {
    event_id: "ev-019",
    title: "Music Festival 2026",
    date: "2026-06-23T00:00:00Z",
    location: "Central World",
    ticket_price: 200,
  },
  {
    event_id: "ev-020",
    title: "Design Week 2025",
    date: "2025-09-30T00:00:00Z",
    location: "Union Hall",
    ticket_price: 2500,
  },
  {
    event_id: "ev-021",
    title: "Art Exhibition 2027",
    date: "2026-07-16T00:00:00Z",
    location: "QSNCC",
    ticket_price: 5000,
  },
  {
    event_id: "ev-022",
    title: "Music Festival 2026",
    date: "2026-03-12T00:00:00Z",
    location: "Impact Arena",
    ticket_price: 200,
  },
  {
    event_id: "ev-023",
    title: "Blockchain Expo 2027",
    date: "2026-07-08T00:00:00Z",
    location: "Central World",
    ticket_price: 5000,
  },
  {
    event_id: "ev-024",
    title: "Blockchain Expo 2026",
    date: "2026-10-13T00:00:00Z",
    location: "QSNCC",
    ticket_price: 0,
  },
  {
    event_id: "ev-025",
    title: "Business Summit 2026",
    date: "2026-05-14T00:00:00Z",
    location: "Union Hall",
    ticket_price: 990,
  },
  {
    event_id: "ev-026",
    title: "Car Show 2025",
    date: "2025-12-09T00:00:00Z",
    location: "Phuket Convention Center",
    ticket_price: 5000,
  },
  {
    event_id: "ev-027",
    title: "AI Workshop 2026",
    date: "2026-04-18T00:00:00Z",
    location: "Union Hall",
    ticket_price: 200,
  },
  {
    event_id: "ev-028",
    title: "Design Week 2026",
    date: "2026-11-27T00:00:00Z",
    location: "Chiang Mai Hall",
    ticket_price: 1500,
  },
  {
    event_id: "ev-029",
    title: "Business Summit 2026",
    date: "2027-03-17T00:00:00Z",
    location: "Union Hall",
    ticket_price: 990,
  },
  {
    event_id: "ev-030",
    title: "Book Launch 2027",
    date: "2026-07-16T00:00:00Z",
    location: "Chiang Mai Hall",
    ticket_price: 500,
  },
  {
    event_id: "ev-031",
    title: "Book Launch 2026",
    date: "2027-02-28T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 990,
  },
  {
    event_id: "ev-032",
    title: "AI Workshop 2026",
    date: "2027-01-27T00:00:00Z",
    location: "BITEC Bangna",
    ticket_price: 0,
  },
  {
    event_id: "ev-033",
    title: "Film Festival 2025",
    date: "2025-06-26T00:00:00Z",
    location: "Phuket Convention Center",
    ticket_price: 100,
  },
  {
    event_id: "ev-034",
    title: "Science Fair 2026",
    date: "2027-02-12T00:00:00Z",
    location: "QSNCC",
    ticket_price: 0,
  },
  {
    event_id: "ev-035",
    title: "Film Festival 2026",
    date: "2026-10-28T00:00:00Z",
    location: "Siam Paragon",
    ticket_price: 5000,
  },
  {
    event_id: "ev-036",
    title: "Game Jam 2025",
    date: "2025-06-05T00:00:00Z",
    location: "True Digital Park",
    ticket_price: 0,
  },
  {
    event_id: "ev-037",
    title: "Game Jam 2026",
    date: "2026-06-01T00:00:00Z",
    location: "Impact Arena",
    ticket_price: 100,
  },
  {
    event_id: "ev-038",
    title: "Yoga Retreat 2026",
    date: "2026-05-23T00:00:00Z",
    location: "Central World",
    ticket_price: 2500,
  },
  {
    event_id: "ev-039",
    title: "Startup Pitch 2027",
    date: "2026-07-18T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 990,
  },
  {
    event_id: "ev-040",
    title: "Pet Expo 2026",
    date: "2026-05-04T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 990,
  },
  {
    event_id: "ev-041",
    title: "AI Workshop 2026",
    date: "2026-09-28T00:00:00Z",
    location: "Impact Arena",
    ticket_price: 0,
  },
  {
    event_id: "ev-042",
    title: "Coding Bootcamp 2026",
    date: "2026-08-01T00:00:00Z",
    location: "BITEC Bangna",
    ticket_price: 500,
  },
  {
    event_id: "ev-043",
    title: "Startup Pitch 2026",
    date: "2026-06-05T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 2500,
  },
  {
    event_id: "ev-044",
    title: "Blockchain Expo 2027",
    date: "2026-08-13T00:00:00Z",
    location: "Thunder Dome",
    ticket_price: 500,
  },
  {
    event_id: "ev-045",
    title: "Marketing Seminar 2025",
    date: "2025-07-28T00:00:00Z",
    location: "Siam Paragon",
    ticket_price: 0,
  },
  {
    event_id: "ev-046",
    title: "E-sports Tournament 2025",
    date: "2025-09-13T00:00:00Z",
    location: "Chiang Mai Hall",
    ticket_price: 500,
  },
  {
    event_id: "ev-047",
    title: "Book Launch 2027",
    date: "2026-04-10T00:00:00Z",
    location: "Chiang Mai Hall",
    ticket_price: 0,
  },
  {
    event_id: "ev-048",
    title: "Art Exhibition 2026",
    date: "2026-04-11T00:00:00Z",
    location: "Siam Paragon",
    ticket_price: 0,
  },
  {
    event_id: "ev-049",
    title: "Business Summit 2025",
    date: "2025-08-20T00:00:00Z",
    location: "Siam Paragon",
    ticket_price: 5000,
  },
  {
    event_id: "ev-050",
    title: "Business Summit 2026",
    date: "2026-11-21T00:00:00Z",
    location: "Union Hall",
    ticket_price: 5000,
  },
];

const COLORS = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#d946ef", "#9ca3af"];

function AnalyticDashboardChart() {
  const [timeFilter, setTimeFilter] = useState("month"); 

  // คำนวณข้อมูลเพียง 1 ครั้ง ส่งไปให้กราฟใช้ร่วมกัน
  const chartData = useMemo(() => {
    const CURRENT_DATE = new Date("2026-06-14T10:10:18+07:00");
    const currentYear = CURRENT_DATE.getFullYear();
    const currentMonth = CURRENT_DATE.getMonth();

    const startOfWeek = new Date(CURRENT_DATE);
    startOfWeek.setDate(CURRENT_DATE.getDate() - CURRENT_DATE.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const validTickets = ticketsData.filter(
      (t) => t.status === "PAID" || t.status === "USED" || t.status === "RESERVED"
    );

    const salesCount: Record<string, number> = {};
    let totalSales = 0;

    validTickets.forEach((ticket) => {
      const event = eventsData.find((e) => e.event_id === ticket.event_id);
      if (!event) return;

      const eventDate = new Date(event.date);
      let isMatch = false;
      
      if (timeFilter === "week") {
        isMatch = eventDate >= startOfWeek && eventDate <= endOfWeek;
      } else if (timeFilter === "month") {
        isMatch = eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;
      } else if (timeFilter === "year") {
        isMatch = eventDate.getFullYear() === currentYear;
      }

      if (isMatch) {
        salesCount[event.title] = (salesCount[event.title] || 0) + 1;
        totalSales += 1;
      }
    });

    const sortedSales = Object.entries(salesCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    if (totalSales === 0) return [];

    const top5 = sortedSales.slice(0, 5);
    const others = sortedSales.slice(5);
    
    let finalData = top5.map((item, index) => ({
      ...item,
      percentage: ((item.value / totalSales) * 100).toFixed(2),
      fill: COLORS[index % COLORS.length]
    }));

    if (others.length > 0) {
      const othersValue = others.reduce((sum, item) => sum + item.value, 0);
      finalData.push({
        name: "อื่นๆ",
        value: othersValue,
        percentage: ((othersValue / totalSales) * 100).toFixed(2),
        fill: COLORS[finalData.length % COLORS.length]
      });
    }

    return finalData;
  }, [timeFilter]);

  return (
    <div className={styles.dashboardWrapper}>
      <h2 className={styles.mainTitle}>กราฟภาพรวม</h2>

      <div className={styles.orangeBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerIconContainer}>
            <span className={styles.botIcon}>🤖</span>
            <span className={styles.chatIcon}>💬</span>
          </div>
          <span className={styles.bannerText}>
            ข้อมูลรายวัน รายสัปดาห์ หลายอย่างเต็มไปหมด ให้ AI chatbot จัดการสรุปให้แค่ไม่กี่ประโยค
          </span>
        </div>
        <span className={styles.arrowIcon}>→</span>
      </div>

      {/* กล่องสีเทา: กราฟวงกลม */}
      <div className={styles.greySection}>
        <h3 className={styles.sectionTitle}>สัดส่วนการซื้อตั๋ว - กราฟวงกลม</h3>
        <div className={styles.whiteCard}>
          <div className={styles.chartHeader}>
            <h4 className={styles.innerTitle}></h4>
            <select
              className={styles.timeFilter}
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="week">สัปดาห์นี้</option>
              <option value="month">เดือนนี้</option>
              <option value="year">ปีนี้</option>
            </select>
          </div>
          
          <TicketPieChart data={chartData} />
        </div>
      </div>

      {/* กล่องสีเทา: กราฟแท่ง */}
      <div className={styles.greySection}>
        <h3 className={styles.sectionTitle}>สัดส่วนการซื้อตั๋ว - กราฟแท่ง</h3>
        <div className={styles.whiteCard}>
          
          <TicketBarChart data={chartData} />
        </div>
      </div>

    </div>
  );
}

function AnalyticPageInner() {
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
        }}
      />
      <div className={styles.eventsArea}>
        <AnalyticDashboardChart />
      </div>
      <Footer />
    </div>
  );
}

const AnalyticPage = () => (
  <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
    <AnalyticPageInner />
  </Suspense>
);

export default AnalyticPage;