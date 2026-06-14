"use client";
import React, { useMemo, useState } from 'react';
import { Tooltip } from '@mantine/core';
import styles from './StageOverview.module.scss';
import type { Ticket } from '@/app/concert/types';
import ticketsData from '@/data/event_tickets.json';

interface ZoneSummary {
  total: number;
  used: number;
  reserved: number;
  cancelled: number;
  refunded: number;
  paid: number;
}

interface StageOverviewProps {
  onZoneClick: (zoneId: string) => void;
  tickets: Ticket[];
  eventId: string;
}

function summarizeByTicketZone(tickets: Ticket[]): Record<string, ZoneSummary> {
  const map: Record<string, ZoneSummary> = {};
  for (const t of tickets) {
    const zone = t.seat_zone;
    if (!map[zone]) {
      map[zone] = { total: 0, used: 0, reserved: 0, cancelled: 0, refunded: 0, paid: 0 };
    }
    map[zone].total += 1;
    switch (t.status) {
      case "USED": map[zone].used += 1; break;
      case "RESERVED": map[zone].reserved += 1; break;
      case "CANCELLED": map[zone].cancelled += 1; break;
      case "REFUNDED": map[zone].refunded += 1; break;
      case "PAID": map[zone].paid += 1; break;
    }
  }
  return map;
}

function getSummaryForZone(
  zoneKey: string,
  ticketZoneSummary: Record<string, ZoneSummary>
): ZoneSummary | undefined {
  return ticketZoneSummary[zoneKey];
}

function ZoneTooltipContent({ zoneId, summary }: { zoneId: string; summary?: ZoneSummary }) {
  if (!summary || summary.total === 0) {
    return (
      <div style={{ fontSize: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Zone {zoneId}</div>
        <div>ไม่พบข้อมูลตั๋ว</div>
      </div>
    );
  }
  return (
    <div style={{ fontSize: 12, lineHeight: 1.5 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Zone {zoneId}</div>
      <div>ทั้งหมด: {summary.total} ตั๋ว</div>
      <div>ใช้แล้ว: {summary.used} ตั๋ว</div>
      <div>จ่ายแล้ว: {summary.paid} ตั๋ว</div>
      <div>จอง: {summary.reserved} ตั๋ว</div>
      <div>ยกเลิก: {summary.cancelled} ตั๋ว</div>
      <div>คืนเงิน: {summary.refunded} ตั๋ว</div>
    </div>
  );
}

// Tooltip ขึ้นตรงอันที่กด/hover — แต่ content คือ logical zone
function ZoneTooltip({
  tooltipZoneId,   // content ใน tooltip (A, B, C, D, Standing)
  blockId,         // id เฉพาะของ element นี้สำหรับ open state
  summary,
  activeId,
  setActiveId,
  children,
}: {
  tooltipZoneId: string;
  blockId: string;
  summary?: ZoneSummary;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  children: React.ReactNode;
}) {
  const opened = activeId === blockId;

  return (
    <Tooltip
      label={<ZoneTooltipContent zoneId={tooltipZoneId} summary={summary} />}
      withArrow
      opened={opened}
    >
      <g
        onClick={() => setActiveId(opened ? null : blockId)}
        onMouseEnter={() => setActiveId(blockId)}
        onMouseLeave={() => setActiveId(null)}
        className="cursor-pointer"
      >
        {children}
      </g>
    </Tooltip>
  );
}

function ZoneWedge({
  block,
  tooltipZoneId,
  blockId,
  rIn,
  rOut,
  pathClassName,
  textClassName,
  summary,
  onClick,
  activeId,
  setActiveId,
  r,
  getArcPath,
  getLabelCoords,
}: {
  block: { id: string; start: number; end: number };
  tooltipZoneId: string;
  blockId: string;
  rIn: number;
  rOut: number;
  pathClassName: string;
  textClassName: string;
  summary?: ZoneSummary;
  onClick: () => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  r: (n: number) => number;
  getArcPath: (rIn: number, rOut: number, startAngle: number, endAngle: number) => string;
  getLabelCoords: (rIn: number, rOut: number, startAngle: number, endAngle: number) => { x: number; y: number; angle: number };
}) {
  const pathD = getArcPath(rIn, rOut, block.start, block.end);
  const textPos = getLabelCoords(rIn, rOut, block.start, block.end);

  return (
    <ZoneTooltip
      tooltipZoneId={tooltipZoneId}
      blockId={blockId}
      summary={summary}
      activeId={activeId}
      setActiveId={(id) => {
        setActiveId(id);
        if (id) onClick();
      }}
    >
      <path d={pathD} className={pathClassName} />
      <text
        x={r(textPos.x)}
        y={r(textPos.y + 3.5)}
        textAnchor="middle"
        className={textClassName}
      >
        {block.id}
      </text>
    </ZoneTooltip>
  );
}

export default function StageOverview({
  onZoneClick,
  tickets,
  eventId,
}: StageOverviewProps) {
  const width = 800;
  const height = 630;
  const cx = 400;
  const cy = 210;

  const r1_in = 205;
  const r1_out = 250;
  const r2_in = 260;
  const r2_out = 305;
  const r = (n: number) => Math.round(n * 1000) / 1000;
  const rad = (deg: number) => (deg * Math.PI) / 180;

  const getArcPath = (rIn: number, rOut: number, startAngle: number, endAngle: number) => {
    const x1 = cx + rOut * Math.cos(rad(startAngle));
    const y1 = cy + rOut * Math.sin(rad(startAngle));
    const x2 = cx + rOut * Math.cos(rad(endAngle));
    const y2 = cy + rOut * Math.sin(rad(endAngle));
    const x3 = cx + rIn * Math.cos(rad(endAngle));
    const y3 = cy + rIn * Math.sin(rad(endAngle));
    const x4 = cx + rIn * Math.cos(rad(startAngle));
    const y4 = cy + rIn * Math.sin(rad(startAngle));
    return `M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 0 0 ${x4} ${y4} Z`;
  };

  const getLabelCoords = (rIn: number, rOut: number, startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = (rIn + rOut) / 2;
    return {
      x: cx + textRadius * Math.cos(rad(midAngle)),
      y: cy + textRadius * Math.sin(rad(midAngle)),
      angle: midAngle + 90,
    };
  };

  const blocks1F: { id: string; start: number; end: number }[] = [];
  const right1F_start = 348, right1F_end = 405;
  const right1F_step = (right1F_end - right1F_start) / 5;
  for (let i = 0; i < 5; i++) blocks1F.push({ id: (i + 1).toString(), start: right1F_start + i * right1F_step + 0.5, end: right1F_start + (i + 1) * right1F_step - 0.5 });
  const bottom1F_start = 416, bottom1F_end = 484;
  const bottom1F_step = (bottom1F_end - bottom1F_start) / 7;
  for (let i = 0; i < 7; i++) blocks1F.push({ id: (6 + i).toString(), start: bottom1F_start + i * bottom1F_step + 0.4, end: bottom1F_start + (i + 1) * bottom1F_step - 0.4 });
  const left1F_start = 495, left1F_end = 552;
  const left1F_step = (left1F_end - left1F_start) / 5;
  for (let i = 0; i < 5; i++) blocks1F.push({ id: (13 + i).toString(), start: left1F_start + i * left1F_step + 0.5, end: left1F_start + (i + 1) * left1F_step - 0.5 });

  const blocks2F: { id: string; start: number; end: number }[] = [];
  const right2F_step = (right1F_end - right1F_start) / 5;
  for (let i = 0; i < 5; i++) blocks2F.push({ id: (26 + i).toString(), start: right1F_start + i * right2F_step + 0.5, end: right1F_start + (i + 1) * right2F_step - 0.5 });
  const bottom2F_start = 413, bottom2F_end = 487;
  const bottom2F_step = (bottom2F_end - bottom2F_start) / 11;
  for (let i = 0; i < 11; i++) blocks2F.push({ id: (31 + i).toString(), start: bottom2F_start + i * bottom2F_step + 0.3, end: bottom2F_start + (i + 1) * bottom2F_step - 0.3 });
  const left2F_step = (left1F_end - left1F_start) / 4;
  for (let i = 0; i < 4; i++) blocks2F.push({ id: (42 + i).toString(), start: left1F_start + i * left2F_step + 0.5, end: left1F_start + (i + 1) * left2F_step - 0.5 });

  const eventTickets = useMemo(() => {
    const source = tickets ?? (ticketsData as Ticket[]);
    return source.filter((t) => t.event_id === eventId);
  }, [tickets, eventId]);

  const ticketZoneSummary = useMemo(
    () => summarizeByTicketZone(eventTickets),
    [eventTickets]
  );

  // activeId = blockId เฉพาะของ element ที่ถูก hover/click อยู่
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] rounded-3xl border border-slate-200 shadow-xl overflow-hidden w-full max-w-3xl mx-auto" id="stage-overview-diagram">
      <div className="relative w-full aspect-[4/3] max-h-[460px] bg-[#f8f9fa] rounded-2xl select-none" id="arena-map-viewport">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">

          <g opacity="0.15">
            <line x1={cx} y1={0} x2={cx} y2={height} stroke="#343a40" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx={cx} cy={cy} r={r1_in} fill="none" stroke="#343a40" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={r2_in} fill="none" stroke="#343a40" strokeWidth="1" />
          </g>

          <g stroke="#ffffff" strokeWidth="2" opacity="0.9" fill="none">
            <line x1={cx + (r1_in - 5) * Math.cos(rad(411.5))} y1={cy + (r1_in - 5) * Math.sin(rad(411.5))} x2={cx + (r1_out + 5) * Math.cos(rad(411.5))} y2={cy + (r1_out + 5) * Math.sin(rad(411.5))} stroke="#ced4da" strokeWidth="3" />
            <line x1={cx + (r1_in - 5) * Math.cos(rad(488.5))} y1={cy + (r1_in - 5) * Math.sin(rad(488.5))} x2={cx + (r1_out + 5) * Math.cos(rad(488.5))} y2={cy + (r1_out + 5) * Math.sin(rad(488.5))} stroke="#ced4da" strokeWidth="3" />
          </g>

          <g fill="#495057">
            <rect x={cx - 15} y={80} width={30} height={390} rx={1} />
            <rect x={180} y={248} width={440} height={20} rx={1} />
          </g>

          <g id="standing-floor-zones">
            {/* Standing Floor B (left) */}
            <ZoneTooltip
              tooltipZoneId="Standing"
              blockId="SF-B"
              summary={getSummaryForZone("Standing", ticketZoneSummary)}
              activeId={activeId}
              setActiveId={(id) => { setActiveId(id); if (id) onZoneClick?.("Standing"); }}
            >
              <path d="M 185,115 L 235,80 L 370,80 L 370,235 L 235,235 L 230,205 L 185,205 Z" className={`${styles.standingZone} transition-all duration-200 stroke-[4]`} />
              <text x={268} y={168} textAnchor="middle" className="font-sans font-bold text-[8.5px] fill-rose-100 tracking-wider pointer-events-none">STANDING</text>
              <text x={268} y={184} textAnchor="middle" className="font-mono font-black text-[9px] fill-rose-200 pointer-events-none">FLOOR</text>
            </ZoneTooltip>

            {/* Standing Floor A (right) */}
            <ZoneTooltip
              tooltipZoneId="Standing"
              blockId="SF-A"
              summary={getSummaryForZone("Standing", ticketZoneSummary)}
              activeId={activeId}
              setActiveId={(id) => { setActiveId(id); if (id) onZoneClick?.("Standing"); }}
            >
              <path d="M 615,115 L 565,80 L 430,80 L 430,235 L 565,235 L 570,205 L 615,205 Z" className={`${styles.standingZone} transition-all duration-200 stroke-[4]`} />
              <text x={532} y={168} textAnchor="middle" className="font-sans font-bold text-[8.5px] fill-rose-100 tracking-wider pointer-events-none">STANDING</text>
              <text x={532} y={184} textAnchor="middle" className="font-mono font-black text-[9px] fill-rose-200 pointer-events-none">FLOOR</text>
            </ZoneTooltip>

            {/* Zone D */}
            <ZoneTooltip
              tooltipZoneId="D"
              blockId="zone-D"
              summary={getSummaryForZone("D", ticketZoneSummary)}
              activeId={activeId}
              setActiveId={(id) => { setActiveId(id); if (id) onZoneClick?.("D"); }}
            >
              <path d="M 205,282 L 370,282 L 370,395 L 325,395 L 245,395 L 205,340 Z" className={`${styles.standingZone} transition-all duration-200 stroke-[4]`} />
              <text x={287} y={345} textAnchor="middle" className="font-sans font-black text-xl fill-white pointer-events-none">D</text>
            </ZoneTooltip>

            {/* Zone C */}
            <ZoneTooltip
              tooltipZoneId="C"
              blockId="zone-C"
              summary={getSummaryForZone("C", ticketZoneSummary)}
              activeId={activeId}
              setActiveId={(id) => { setActiveId(id); if (id) onZoneClick?.("C"); }}
            >
              <path d="M 595,282 L 430,282 L 430,395 L 475,395 L 555,395 L 595,340 Z" className={`${styles.standingZone} transition-all duration-200 stroke-[4]`} />
              <text x={513} y={345} textAnchor="middle" className="font-sans font-black text-xl fill-white pointer-events-none">C</text>
            </ZoneTooltip>
          </g>

          <g id="stage-arena-platform">
            <rect x={290} y={15} width={220} height={70} rx={1} fill="#343a40" stroke="#1e2530" strokeWidth="2.5" />
            <text x={400} y={58} textAnchor="middle" className="font-sans fill-white text-[24px] font-black tracking-[0.2em]">STAGE</text>
            <line x1={cx} y1={85} x2={cx} y2={105} stroke="#343a40" strokeWidth="20" />
          </g>

          {/* Ring 1F — เลขที่นั่ง 1-17, tooltip Zone B */}
          <g id="ring-1F-wedges">
            {blocks1F.map((block) => (
              <ZoneWedge
                key={block.id}
                block={block}
                tooltipZoneId="B"
                blockId={`1F-${block.id}`}
                rIn={r1_in}
                rOut={r1_out}
                pathClassName={`${styles.ring1F} transition-all duration-200 stroke-[#495057] stroke-2`}
                textClassName="font-sans text-[11px] font-black select-none pointer-events-none fill-white"
                summary={getSummaryForZone("B", ticketZoneSummary)}
                onClick={() => onZoneClick?.("B")}
                activeId={activeId}
                setActiveId={setActiveId}
                r={r}
                getArcPath={getArcPath}
                getLabelCoords={getLabelCoords}
              />
            ))}
          </g>

          {/* Ring 2F — เลขที่นั่ง 26-45, tooltip Zone A */}
          <g id="ring-2F-wedges">
            {blocks2F.map((block) => (
              <ZoneWedge
                key={block.id}
                block={block}
                tooltipZoneId="A"
                blockId={`2F-${block.id}`}
                rIn={r2_in}
                rOut={r2_out}
                pathClassName={`${styles.ring2F} transition-all duration-200 stroke-[#495057] stroke-2`}
                textClassName="font-sans text-[10px] font-black select-none pointer-events-none fill-slate-900"
                summary={getSummaryForZone("A", ticketZoneSummary)}
                onClick={() => onZoneClick?.("A")}
                activeId={activeId}
                setActiveId={setActiveId}
                r={r}
                getArcPath={getArcPath}
                getLabelCoords={getLabelCoords}
              />
            ))}
          </g>

        </svg>
      </div>
    </div>
  );
}