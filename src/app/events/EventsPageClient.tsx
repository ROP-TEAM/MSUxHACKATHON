"use client";
import { Select } from "@mantine/core";
import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { PosterEvent } from "@/components/home/homeData";
import PosterCard from "@/components/ui/PosterCard/PosterCard";
import styles from "./EventsPageClient.module.scss";
import { Popover, UnstyledButton } from "@mantine/core";

const ITEMS_PER_PAGE = 18;

type PriceRange =
  | "all"
  | "free"
  | "lt500"
  | "500-1500"
  | "1500-3000"
  | "gt3000";
type DateRange = "all" | "thisMonth" | "nextMonth" | "next3Months";

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "all", label: "ราคาบัตร" },
  { value: "free", label: "ฟรี" },
  { value: "lt500", label: "ต่ำกว่า 500" },
  { value: "500-1500", label: "500 – 1,500" },
  { value: "1500-3000", label: "1,500 – 3,000" },
  { value: "gt3000", label: "มากกว่า 3,000" },
];

const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "all", label: "วันที่" },
  { value: "thisMonth", label: "เดือนนี้" },
  { value: "nextMonth", label: "เดือนหน้า" },
  { value: "next3Months", label: "3 เดือนข้างหน้า" },
];

type Props = {
  allEvents: PosterEvent[];
  categories: string[];
};

function getPaginationRange(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function FilterSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [opened, setOpened] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || value;

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      offset={4}
      radius="md"
    >
      <Popover.Target>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1.5rem",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "1rem",
            color: "inherit",
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
                    ? "4px solid var(--p-500)"
                    : "4px solid transparent",
                  backgroundColor: isSelected ? "#f8f9fa" : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
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
export default function EventsPageClient({ allEvents }: Props) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [priceFilter, setPriceFilter] = useState<PriceRange>("all");
  const [dateFilter, setDateFilter] = useState<DateRange>("all");
  const [venueFilter, setVenueFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [visiblePage, setVisiblePage] = useState(1);
  const [gridExiting, setGridExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  const now = useMemo(() => new Date("2026-06-14T00:00:00Z"), []);
  const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

  const venues = useMemo(() => {
    const unique = [...new Set(allEvents.map((e) => e.venue).filter(Boolean))];
    return unique as string[];
  }, [allEvents]);

  const filtered = useMemo(() => {
    let list = [...allEvents];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q),
      );
    }

    if (priceFilter !== "all") {
      list = list.filter((e) => {
        const p = e.price ?? 0;
        if (priceFilter === "free") return p === 0;
        if (priceFilter === "lt500") return p > 0 && p < 500;
        if (priceFilter === "500-1500") return p >= 500 && p <= 1500;
        if (priceFilter === "1500-3000") return p > 1500 && p <= 3000;
        if (priceFilter === "gt3000") return p > 3000;
        return true;
      });
    }

    if (dateFilter !== "all") {
      const nowMs = now.getTime();
      list = list.filter((e) => {
        const t = new Date(e.rawDate).getTime();
        if (dateFilter === "thisMonth")
          return t >= nowMs && t < nowMs + MONTH_MS;
        if (dateFilter === "nextMonth")
          return t >= nowMs + MONTH_MS && t < nowMs + 2 * MONTH_MS;
        if (dateFilter === "next3Months")
          return t >= nowMs && t < nowMs + 3 * MONTH_MS;
        return true;
      });
    }

    if (venueFilter !== "all") {
      list = list.filter((e) => e.venue === venueFilter);
    }

    return list;
  }, [allEvents, search, priceFilter, dateFilter, venueFilter, now, MONTH_MS]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageEvents = filtered.slice(
    (visiblePage - 1) * ITEMS_PER_PAGE,
    visiblePage * ITEMS_PER_PAGE,
  );

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  function resetPage() {
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setPage(1);
    setVisiblePage(1);
    setGridExiting(false);
  }

  function changePage(next: number) {
    if (next === visiblePage || gridExiting) return;
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setGridExiting(true);
    setPage(next);
    exitTimer.current = setTimeout(() => {
      setVisiblePage(next);
      setGridExiting(false);
    }, 280);
  }

  return (
    <div className={styles.wrapper}>
      {/* filter row */}
      <div className={styles.filterRow}>
        <div className={styles.filterLeft}>
          <FilterSelect
            options={PRICE_OPTIONS}
            value={priceFilter}
            onChange={(v) => {
              setPriceFilter(v as PriceRange);
              resetPage();
            }}
          />
          <FilterSelect
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={(v) => {
              setDateFilter(v as DateRange);
              resetPage();
            }}
          />
          {venues.length > 0 && (
            <FilterSelect
              options={[
                { value: "all", label: "สถานที่" },
                ...venues.map((v) => ({ value: v, label: v })),
              ]}
              value={venueFilter}
              onChange={(v) => {
                setVenueFilter(v);
                resetPage();
              }}
            />
          )}
        </div>

        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="ค้นหาอีเวนต์ของคุณ"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
          {search && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setSearch("");
                resetPage();
              }}
              aria-label="ล้างค้นหา"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* section heading */}
      <h2 className={styles.sectionTitle}>งานทั้งหมด</h2>

      {/* grid */}
      {pageEvents.length > 0 ? (
        <div
          className={`${styles.grid}${gridExiting ? ` ${styles.gridExit}` : ""}`}
          key={visiblePage}
        >
          {pageEvents.map((event) => (
            <PosterCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>ไม่พบกิจกรรม</p>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {paginationRange.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ""}`}
                onClick={() => changePage(p as number)}
              >
                {p}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
