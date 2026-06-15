"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Popover, UnstyledButton } from "@mantine/core";
import { Modal } from "@mantine/core";
import eventsData from "@/data/events.json"; // ← ยังใช้อยู่เพื่อ join location
import ticketsData from "@/data/event_tickets.json"; // ← เพิ่ม
import user from "@/data/users.json";
import IconSvgMono from "@/components/icon/SvgIcon";
import { simulationStore } from "@/lib/simulation-store";

// ────────────────────────────────────────────────────────────
// User type + helpers
// ────────────────────────────────────────────────────────────
type User = {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  loyalty_points: number;
  role: string;
};

/** O(1) lookup map: user_id → User */
const userMap: Record<string, User> = Object.fromEntries(
  (user as User[]).map((u) => [u.user_id, u]),
);

/** ดึงข้อมูล user จาก user_id — คืน undefined ถ้าไม่พบ */
function getUserById(userId: string): User | undefined {
  return userMap[userId];
}

// ────────────────────────────────────────────────────────────
// Lookup map: event_id → location  (join จาก events.json)
// ────────────────────────────────────────────────────────────
const eventLocationMap: Record<string, string> = Object.fromEntries(
  (eventsData as { event_id: string; location: string }[]).map((e) => [
    e.event_id,
    e.location,
  ]),
);

// ────────────────────────────────────────────────────────────
// Unique venue list  ← อ่านจาก event_tickets.json + join location
// ────────────────────────────────────────────────────────────
const uniqueVenues = [
  ...new Set(
    (ticketsData as { event_id: string }[])
      .map((t) => eventLocationMap[t.event_id])
      .filter(Boolean),
  ),
];

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
        style={{ padding: "0.5rem 0rem", width: "max-content" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
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

const STATUS_CONFIG: Record<TicketStatus, { icon: string; color: string }> = {
  CANCELLED: { icon: "/icon/cancle.svg", color: "#DC2626" },
  USED: { icon: "/icon/used.svg", color: "#16A34A" },
  RESERVED: { icon: "/icon/reserved.svg", color: "#7C3AED" },
  REFUNDED: { icon: "/icon/refunded.svg", color: "#2563EB" },
  PAID: { icon: "/icon/paid.svg", color: "#D97706" },
};

export default function Overview() {
  const [selectedTicket, setSelectedTicket] = useState<
    (typeof mergedTickets)[0] | null
  >(null);
  const [price, setPrice] = useState("all");
  const [venue, setVenue] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const mergedTickets = useSyncExternalStore(
    simulationStore.subscribeMerged,
    () => simulationStore.getMergedSnapshot(),
    () => simulationStore.getMergedServerSnapshot(),
  );

  const filteredTickets = useMemo(() => {
    return mergedTickets.filter((ticket) => {
      const matchSearch =
        search === "" ||
        ticket.name.toLowerCase().includes(search.toLowerCase()) ||
        ticket.eventTitle.toLowerCase().includes(search.toLowerCase());

      // join location ผ่าน eventLocationMap แทนการเก็บ location ใน mergedTickets โดยตรง
      const ticketLocation =
        eventLocationMap[ticket.event_id] ?? ticket.location;
      const matchVenue = venue === "all" || ticketLocation === venue;
      const matchStatus = status === "all" || ticket.status === status;
      const matchPrice =
        price === "all" ||
        (price === "500" && ticket.price < 500) ||
        (price === "1000" && ticket.price >= 500 && ticket.price <= 1000) ||
        (price === "1500" && ticket.price > 1000);

      return matchSearch && matchVenue && matchStatus && matchPrice;
    });
  }, [mergedTickets, search, venue, status, price]);

  // ── Filter options ────────────────────────────────────────
  const priceOptions = [
    { value: "500", label: "ต่ำกว่า 500" },
    { value: "1000", label: "500 - 1000" },
    { value: "1500", label: "มากกว่า 1000" },
  ];

  // venueOptions  ← derive จาก event_tickets.json (ผ่าน uniqueVenues ด้านบน)
  const venueOptions = useMemo(
    () => uniqueVenues.map((loc) => ({ value: loc, label: loc })),
    [],
  );

  const statusOptions = [
    { value: "CANCELLED", label: "CANCELLED" },
    { value: "USED", label: "USED" },
    { value: "RESERVED", label: "RESERVED" },
    { value: "REFUNDED", label: "REFUNDED" },
    { value: "PAID", label: "PAID" },
  ];

  const latestDate =
    mergedTickets.length > 0
      ? (() => {
          const dateObj = new Date(mergedTickets[0].date);
          const dateStr = dateObj.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          });
          const timeStr = dateObj.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return `${dateStr} - ${timeStr} น.`;
        })()
      : "-";

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
          <h2>
            {mergedTickets
              .filter(
                (t) =>
                  t.status === "PAID" ||
                  t.status === "USED" ||
                  t.status === "RESERVED",
              )
              .length.toLocaleString("th-TH")}{" "}
            ใบ
          </h2>
          <div className={styles.ticket}>
            <Image src="/icon/ticket1.svg" alt="icon" width={30} height={30} />
            <p>ขายตั๋วทั้งหมด</p>
          </div>
        </div>

        <div className={styles.right_box}>
          <p>{latestDate}</p>
          <Image
            src="/icon/box.svg"
            alt="icon"
            width={1000}
            height={1000}
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

          <Modal
            opened={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            withCloseButton={false}
          >
            {selectedTicket &&
              (() => {
                const matchedUser = getUserById(selectedTicket.user_id);
                return (
                  <div>
                    <div style={{ position: "relative", marginBottom: "1rem" }}>
                      <Image
                        src="/image/cover.png"
                        width={400}
                        height={100}
                        alt="cover"
                        style={{ height: "auto", margin: "0 auto" }}
                      />
                      <Image
                        src="/image/profile.png"
                        width={120}
                        height={100}
                        alt="profile"
                        style={{
                          height: "auto",
                          margin: "0 auto",
                          position: "absolute",
                          bottom: "-10%",
                          left: "10px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
                      >
                        <h2>{matchedUser?.name || selectedTicket.name}</h2>
                        <p>Email: {matchedUser?.email || "-"}</p>
                      </div>
                      <div
                        style={{
                          padding: "0.25rem 0.8rem",
                          fontWeight: "500",
                          borderRadius: "8px",
                          background:
                            matchedUser?.role == "VIP" ? "#E9D327" : "#BEBEBE",
                          color: "white",
                          fontSize: "0.725rem",
                          marginRight: "1rem",
                        }}
                      >
                        {matchedUser?.role}
                      </div>
                    </div>
                    <hr
                      style={{
                        margin: "1rem 1rem",
                        backgroundColor: "#BEBEBE",
                        color: "#BEBEBE",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ padding: "0 1rem " }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            alignItems: "center",
                          }}
                        >
                          <IconSvgMono
                            src="/icon/phone.svg"
                            width={30}
                            height={30}
                          ></IconSvgMono>
                          <h2>{matchedUser?.phone}</h2>
                        </div>
                        <p
                          style={{
                            margin: "auto",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "1rem",
                          }}
                        >
                          มือถือ
                        </p>
                      </div>
                      <div style={{ padding: "0 1rem " }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            alignItems: "center",
                          }}
                        >
                          <IconSvgMono
                            src="/icon/toom2.svg"
                            width={30}
                            height={30}
                          ></IconSvgMono>
                          <h2>{matchedUser?.loyalty_points}</h2>
                        </div>
                        <p
                          style={{
                            margin: "auto",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "1rem",
                          }}
                        >
                          คะนแนสะสม
                        </p>
                      </div>{" "}
                      <div style={{ padding: "0 1rem " }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            alignItems: "center",
                          }}
                        >
                          <IconSvgMono
                            src="/icon/toom1.svg"
                            width={30}
                            height={30}
                          ></IconSvgMono>
                          <h2>1</h2>
                        </div>
                        <p
                          style={{
                            margin: "auto",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "1rem",
                          }}
                        >
                          ตั๋วที่เคยซื้อ
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </Modal>

          <div className={styles.ticketList}>
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={styles.ticketCard}
                onClick={() => setSelectedTicket(ticket)}
                style={{ cursor: "pointer" }}
              >
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
