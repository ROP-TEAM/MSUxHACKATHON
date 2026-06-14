"use client";

import { Suspense, useState, useMemo } from "react";
import Image from "next/image";
import { Footer } from "@/components/footer/footer";
import styles from "./page.module.scss";
import TicketPieChart from "@/components/analytic/TicketPieChart";
import TicketBarChart from "@/components/analytic/TicketBarChart";
import ticketsData from "@/data/event_tickets.json";
import eventsData from "@/data/events.json";

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