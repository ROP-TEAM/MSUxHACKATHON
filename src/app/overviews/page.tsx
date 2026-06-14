"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Popover, UnstyledButton } from "@mantine/core";

import ticketsData from "@/data/event_tickets.json";
import usersData from "@/data/users.json";
import eventsData from "@/data/events.json";

// --- คอมโพเนนต์ FilterSelect เขียนเองสไตล์ Dime! ---
function FilterSelect({
  options,
  value,
  onChange,
  defaultLabel,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  defaultLabel: string;
}) {
  const [opened, setOpened] = useState(false);

  const selectedLabel =
    value === "all"
      ? defaultLabel
      : options.find((opt) => opt.value === value)?.label || value;

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      offset={4}
      radius="md"
      shadow="md"
    >
      <Popover.Target>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "1rem",
            color: "inherit",
            height: "40px",
          }}
        >
          <span>{selectedLabel}</span>
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </UnstyledButton>
      </Popover.Target>

      <Popover.Dropdown
        style={{
          padding: "0.5rem 0rem",
          width: "max-content",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* เพิ่มตัวเลือก "ทั้งหมด" กลับเข้าไปในลิสต์ Dropdown */}
          <UnstyledButton
            onClick={() => {
              onChange("all");
              setOpened(false);
            }}
            style={{
              width: "100%",
              padding:
                value === "all"
                  ? "0.625rem 1.25rem 0.625rem 1rem"
                  : "0.625rem 1.25rem",
              fontSize: "0.925rem",
              fontFamily: "inherit",
              textAlign: "left",
              fontWeight: value === "all" ? 600 : 400,
              borderLeft:
                value === "all"
                  ? "4px solid var(--p-500)"
                  : "4px solid transparent",
              backgroundColor: value === "all" ? "#f8f9fa" : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f8f9fa")
            }
            onMouseLeave={(e) => {
              if (value !== "all")
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {defaultLabel}
          </UnstyledButton>

          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <UnstyledButton
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpened(false);
                }}
                style={{
                  width: "100%",
                  padding: isSelected
                    ? "0.625rem 1.25rem 0.625rem 1rem"
                    : "0.625rem 1.25rem",
                  fontSize: "0.925rem",
                  fontFamily: "inherit",
                  textAlign: "left",
                  fontWeight: isSelected ? 600 : 400,
                  borderLeft: isSelected
                    ? "4px solid #39e19c"
                    : "4px solid transparent",
                  backgroundColor: isSelected ? "#f8f9fa" : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {option.label}
              </UnstyledButton>
            );
          })}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

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

const STATUS_CONFIG: Record<TicketStatus, { icon: string; color: string }> = {
  CANCELLED: { icon: "/icon/cancle.svg", color: "#DC2626" },
  USED: { icon: "/icon/used.svg", color: "#16A34A" },
  RESERVED: { icon: "/icon/reserved.svg", color: "#7C3AED" },
  REFUNDED: { icon: "/icon/refunded.svg", color: "#2563EB" },
  PAID: { icon: "/icon/paid.svg", color: "#D97706" },
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

  // คัดแยกโครงสร้างข้อมูลส่งเข้าคอมโพเนนต์ Filter
  const priceOptions = [
    { value: "500", label: "ต่ำกว่า 500" },
    { value: "1000", label: "500 - 1000" },
    { value: "1500", label: "มากกว่า 1000" },
  ];

  const venueOptions = useMemo(() => {
    return [...new Set(eventsData.map((e) => e.location))].map((location) => ({
      value: location,
      label: location,
    }));
  }, []);

  const statusOptions = [
    { value: "CANCELLED", label: "CANCELLED" },
    { value: "USED", label: "USED" },
    { value: "RESERVED", label: "RESERVED" },
    { value: "REFUNDED", label: "REFUNDED" },
    { value: "PAID", label: "PAID" },
  ];

  const latestDate =
    tickets.length > 0
      ? new Date(tickets[0].date).toLocaleDateString("th-TH")
      : "-";

  const allLocations = useMemo(
    () => [...new Set(tickets.map((t) => t.location))],
    [tickets],
  );

  return (
    <div className={styles.container}>
      <Image
        src="/image/overview.svg"
        alt="background"
        width={400}
        height={250}
        style={{ width: "100%", height: "100%" }}
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
            <div
              className={styles.filters}
              style={{ display: "flex", gap: "1.5rem" }}
            >
              {/* เปลี่ยนมาใช้คอมโพเนนต์ FilterSelect ทั้งหมด */}
              <FilterSelect
                options={priceOptions}
                value={price}
                onChange={setPrice}
                defaultLabel="ราคาบัตร"
              />

              <FilterSelect
                options={venueOptions}
                value={venue}
                onChange={setVenue}
                defaultLabel="สถานที่"
              />

              <FilterSelect
                options={statusOptions}
                value={status}
                onChange={setStatus}
                defaultLabel="ประเภท"
              />
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

                <h2 style={{ color: ticket.color }}>{ticket.status}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
