import {
  getAllPosterEvents,
  getPosterById as getPosterByIdFromAdapter,
  getSections as getSectionsFromAdapter,
  getCategorySections as getCategorySectionsFromAdapter,
} from "@/lib/event-adapter";

export type PosterEvent = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  /** raw ISO date for sorting/filtering */
  rawDate: string;
  /** two-stop gradient seed for the poster face */
  gradient: [string, string];
  image?: string;
  soldOut?: boolean;
  /** accent color — tints the scattered stars on the detail page */
  accent?: string;
  /** venue shown on the detail page */
  venue?: string;
  /** ticket price in THB */
  price?: number;
  /** ticket fill ratio 0–1 (sold+paid+reserved / total) */
  fillRatio?: number;
};

export const ALL_POSTERS: PosterEvent[] = getAllPosterEvents();

export function getPosterById(id: string): PosterEvent | undefined {
  return getPosterByIdFromAdapter(id);
}

export const SECTIONS: { title: string; events: PosterEvent[] }[] = getSectionsFromAdapter();

export const CATEGORY_SECTIONS: { title: string; events: PosterEvent[] }[] = getCategorySectionsFromAdapter();
