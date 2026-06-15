"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import IconSvgMono from "../icon/SvgIcon";
import { simulationStore, type TicketRow } from "@/lib/simulation-store";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ────────────────────────────────────────────────
// Static event name map — derived from event_tickets.json event_ids
// ────────────────────────────────────────────────

// ────────────────────────────────────────────────
// Colors matching the screenshot
// ────────────────────────────────────────────────
const COLORS = [
  "#8B5CF6",
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EC4899",
  "#9CA3AF",
];
const STATUS_COLORS: Record<string, string> = {
  PAID: "#D97706",
  USED: "#16A34A",
  RESERVED: "#7C3AED",
  REFUNDED: "#2563EB",
  CANCELLED: "#DC2626",
};

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
function buildChartData(tickets: TicketRow[]) {
  const counts: Record<string, number> = {};

  tickets.forEach((ticket) => {
    counts[ticket.status] = (counts[ticket.status] ?? 0) + 1;
  });

  const total = tickets.length;

  const statusOrder = ["PAID", "USED", "RESERVED", "REFUNDED", "CANCELLED"];

  return statusOrder
    .filter((status) => counts[status])
    .map((status) => ({
      name: status,
      value: counts[status],
      pct: total ? (counts[status] / total) * 100 : 0,
    }));
}

// ────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────
interface LegendRowProps {
  color: string;
  pct: number;
  name: string;
}
const LegendRow = ({
  color,
  pct,
  name,
}: {
  color: string;
  pct: number;
  name: string;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: 999,
        background: color,
        marginRight: 12,
      }}
    />

    <div
      style={{
        flex: 1,
        fontSize: 14,
        color: "#111827",
      }}
    >
      {name}
    </div>

    <div
      style={{
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {pct.toFixed(1)}%
    </div>
  </div>
);

// ────────────────────────────────────────────────
// Analytics component
// ────────────────────────────────────────────────
const Analytics = () => {
  const [filter] = useState<"ปีนี้" | "ทั้งหมด">("ปีนี้");

  // Live merged data: real tickets + sim orders + user purchases (same source as /list)
  const tickets = useSyncExternalStore(
    simulationStore.subscribeMerged,
    () => simulationStore.getMergedSnapshot(),
    () => simulationStore.getMergedServerSnapshot(),
  );

  // Filter by current year when "ปีนี้" is selected
  const filtered = useMemo(() => {
    if (filter === "ทั้งหมด") return tickets;
    const year = new Date().getFullYear().toString();
    return tickets.filter((t) => {
      if (!t.date) return true; // include if no date
      return t.date.startsWith(year);
    });
  }, [tickets, filter]);

  const data = useMemo(() => buildChartData(filtered), [filtered]);

  return (
    <div
      style={{
        fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "32px 24px",
      }}
    >
      {/* Page title */}
      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#111827",
          marginBottom: 24,
        }}
      >
        กราฟภาพรวม
      </h1>

      {/* AI banner */}
      <div
        style={{
          backgroundColor: "#F7854C",
          borderRadius: 12,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/icon/chat.svg" width={40} height={40} alt="chat"></Image>
          <span style={{ fontSize: 14 }}>
            ข้อมูลรายวัน รายสัปดาห์ หลายอย่างเต็มไปหมด ให้ AI chatbot
            จัดการสรุปให้แค่ไม่กี่โยค
          </span>
        </div>
        <IconSvgMono
          src="/icon/arrow-foward.svg"
          width={15}
          height={15}
          alt="arrow"
        ></IconSvgMono>
      </div>

      {/* ── Pie chart card ── */}
      <div
        style={{
          backgroundColor: "#F0F0F0",
          borderRadius: 16,
          padding: "24px 28px",
          marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,.06)",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 20,
          }}
        >
          สัดส่วนการซื้อตั๋ว - กราฟวงกลม
        </h2>

        {/* Sub-header + filter */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            สัดส่วนการขาย - ตามอีเวนต์
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {/* Donut */}
          <div style={{ flexShrink: 0 }}>
            <PieChart width={180} height={180}>
              <Pie
                data={data}
                cx={85}
                cy={85}
                innerRadius={52}
                outerRadius={82}
                dataKey="value"
                strokeWidth={2}
                stroke="#F0F0F0"
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[data[i].name] ?? "#9CA3AF"}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>

          {/* Legend */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {data.map((d, i) => (
              <LegendRow
                key={d.name}
                color={STATUS_COLORS[d.name] ?? "#9CA3AF"}
                pct={d.pct}
                name={d.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bar chart card ── */}
      <div
        style={{
          backgroundColor: "#F0F0F0",
          borderRadius: 16,
          padding: "24px 28px",
          boxShadow: "0 1px 4px rgba(0,0,0,.06)",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 24,
          }}
        >
          สัดส่วนการซื้อตั๋ว - กราฟแท่ง
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {/* Bar chart */}
          <div style={{ flex: "0 0 auto", width: 280 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} barCategoryGap="30%">
                <XAxis dataKey="name" hide />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "black" }}
                />
                <Tooltip
                  formatter={(value, _name, entry) => [
                    `${Number(value ?? 0)} ตั๋ว`,
                    (entry as { payload?: { name?: string } }).payload?.name ??
                      "",
                  ]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div style={{ flex: 1, minWidth: 200, paddingTop: 8 }}>
            {data.map((d, i) => (
              <LegendRow
                key={d.name}
                color={COLORS[i % COLORS.length]}
                pct={d.pct}
                name={d.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

// ────────────────────────────────────────────────
// Example usage (remove when integrating):
//
// import ticketsRaw from "@/data/event_tickets.json";
// <Analytics tickets={ticketsRaw} />
// ────────────────────────────────────────────────
