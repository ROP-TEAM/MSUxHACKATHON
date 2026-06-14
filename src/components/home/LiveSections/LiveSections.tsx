"use client";

import { useSyncExternalStore } from "react";
import type { PosterEvent } from "@/components/home/homeData";
import { ALL_POSTERS } from "@/components/home/homeData";
import EventSectionRow from "@/components/home/EventSectionRow/EventSectionRow";
import {
  simulationStore,
  isEventSoldOut,
  computeLiveFill,
  EMPTY_ORDERS,
} from "@/lib/simulation-store";

/** 3 sections with live fillRatio from sim — ใกล้เต็ม updates in realtime */
export default function LiveSections() {
  const orders = useSyncExternalStore(
    simulationStore.subscribe,
    () => simulationStore.getSnapshot().orders,
    () => EMPTY_ORDERS,
  );

  const withLive = ALL_POSTERS.map((e) => ({
    event: e,
    fill: computeLiveFill(e.id, orders),
    soldOut: isEventSoldOut(e.id, orders),
  }));

  const now = new Date("2026-06-14T00:00:00Z");

  // 1. ใกล้เต็ม — top fill ratio, not sold out, at least some tickets
  const nearlyFull = withLive
    .filter(({ fill, soldOut }) => !soldOut && fill > 0)
    .sort((a, b) => b.fill - a.fill)
    .slice(0, 8)
    .map(({ event }) => event);

  // 2. ใหม่ล่าสุด — highest event_id suffix
  const newest = [...ALL_POSTERS]
    .sort((a, b) => {
      const aNum = parseInt(a.id.replace("ev-", ""), 10);
      const bNum = parseInt(b.id.replace("ev-", ""), 10);
      return bNum - aNum;
    })
    .slice(0, 8);

  // 3. ใกล้ถึงวันงาน — future dates, closest first
  const upcoming = ALL_POSTERS
    .filter((e) => new Date(e.rawDate) >= now)
    .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())
    .slice(0, 8);

  const sections = [
    { title: "ใกล้เต็ม", events: nearlyFull },
    { title: "ใหม่ล่าสุด", events: newest },
    { title: "ใกล้ถึงวันงาน", events: upcoming },
  ];

  return sections.map((section) => (
    <EventSectionRow
      key={section.title}
      title={section.title}
      events={section.events}
    />
  ));
}
