"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { useMemo, useState } from "react";

import ticketsData from "@/data/event_tickets.json";
import usersData from "@/data/users.json";
import eventsData from "@/data/events.json";

type TicketStatus = "CANCELLED" | "USED" | "RESERVED" | "REFUNDED" | "PAID";

type TicketRow = {
  id: string;
  name: string;
  eventTitle: string;
  location: string;
  date: string;
  seat: string;
  price: number;
  status: TicketStatus;
  icon: string;
  color: string;
};

const STATUS_CONFIG: Record<
  TicketStatus,
  {
    icon: string;
    color: string;
  }
> = {
  CANCELLED: {
    icon: "/icon/cancle.svg",
    color: "#DC2626",
  },
  USED: {
    icon: "/icon/used.svg",
    color: "#16A34A",
  },
  RESERVED: {
    icon: "/icon/reserved.svg",
    color: "#7C3AED",
  },
  REFUNDED: {
    icon: "/icon/refunded.svg",
    color: "#2563EB",
  },
  PAID: {
    icon: "/icon/paid.svg",
    color: "#D97706",
  },
};

export default function Overview() {
  const [price, setPrice] = useState("all");
  const [venue, setVenue] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const tickets = useMemo<TicketRow[]>(() => {
    return ticketsData
      .map((ticket) => {
        const user = usersData.find((u) => u.user_id === ticket.user_id);

        const event = eventsData.find((e) => e.event_id === ticket.event_id);

        if (!user || !event) return null;

        const statusConfig = STATUS_CONFIG[ticket.status as TicketStatus];

        return {
          id: ticket.ticket_id,
          name: user.name,
          eventTitle: event.title,
          location: event.location,
          date: event.date,
          seat: ticket.seat_zone,
          price: event.ticket_price,
          status: ticket.status as TicketStatus,
          icon: statusConfig.icon,
          color: statusConfig.color,
        };
      })
      .filter((ticket): ticket is TicketRow => ticket !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchSearch =
        search === "" ||
        ticket.name.toLowerCase().includes(search.toLowerCase()) ||
        ticket.eventTitle.toLowerCase().includes(search.toLowerCase());

      const matchVenue = venue === "all" || ticket.location === venue;

      const matchStatus = status === "all" || ticket.status === status;

      const matchPrice =
        price === "all" ||
        (price === "500" && ticket.price < 500) ||
        (price === "1000" && ticket.price >= 500 && ticket.price <= 1000) ||
        (price === "1500" && ticket.price > 1000);

      return matchSearch && matchVenue && matchStatus && matchPrice;
    });
  }, [tickets, search, venue, status, price]);

  const latestDate =
    tickets.length > 0
      ? new Date(tickets[0].date).toLocaleDateString("th-TH")
      : "-";

  return (
    <div className={styles.container}>
      <Image
        src="/image/overview.svg"
        alt="background"
        width={400}
        height={250}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <div className={styles.box}>
        <div className={styles.left_box}>
          <h1>รายการทั้งหมด</h1>
          <h2>{tickets.length.toLocaleString("th-TH")} ใบ</h2>

          <div className={styles.ticket}>
            <Image src="/icon/ticket1.svg" alt="icon" width={30} height={30} />
            <p>ขายตั๋วทั้งหมด</p>
          </div>
        </div>

        <div className={styles.right_box}>
          <p>{latestDate}</p>

          <Image
            src="/image/box.svg"
            alt="icon"
            width={250}
            height={250}
            className={styles.sticker}
          />
        </div>
      </div>

      <div className={styles.tab}>
        <div>
          <div className={styles.filterRow}>
            <div className={styles.filters}>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">ราคาบัตร</option>
                <option value="500">ต่ำกว่า 500</option>
                <option value="1000">500 - 1000</option>
                <option value="1500">มากกว่า 1000</option>
              </select>

              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">สถานที่</option>

                {[...new Set(eventsData.map((e) => e.location))].map(
                  (location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ),
                )}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">ประเภท</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="USED">USED</option>
                <option value="RESERVED">RESERVED</option>
                <option value="REFUNDED">REFUNDED</option>
                <option value="PAID">PAID</option>
              </select>
            </div>

            <div className={styles.searchBox}>
              <svg
                className={styles.searchIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="ค้นหาอีเวนต์"
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.ticketList}>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className={styles.ticketCard}>
                <div className={styles.details}>
                  <Image
                    src={ticket.icon}
                    alt={ticket.status}
                    width={60}
                    height={60}
                  />

                  <div className={styles.text}>
                    <h3>{ticket.name}</h3>

                    <div className={styles.user}>
                      <p>{ticket.eventTitle}</p>
                      <p>{new Date(ticket.date).toLocaleDateString("th-TH")}</p>
                      <p>Zone {ticket.seat}</p>
                    </div>
                  </div>
                </div>

                <h2
                  style={{
                    color: ticket.color,
                  }}
                >
                  {ticket.status}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
