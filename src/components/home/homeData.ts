// Curated mock content for the iTiket home page. Real ecommerce data
// (src/data/events.json) is generic exhibitions; the design calls for
// concert posters, so these seeds drive the gradient poster placeholders.

export type PosterEvent = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
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
};

export type NewsItem = {
  id: string;
  badge: { label: string; tone: "exclusive" | "hot" };
  headline: string;
  source: string;
  gradient: [string, string];
};

const POSTERS: PosterEvent[] = [
  { id: "p1", title: "LIGHT AS ONE", subtitle: "Reunion Concert", date: "26 ก.ค. 2026", gradient: ["#3a3f4b", "#11131a"], image: "/image/card1.jpg", soldOut: true, accent: "#ac2297", venue: "อิมแพค อารีน่า เมืองทองธานี", price: 500 },
  { id: "p2", title: "ONE OF JUNE", subtitle: "Ryeowook Concert", date: "9 ส.ค. 2026", gradient: ["#5fa8e6", "#bfe3ff"], image: "/image/card2.png", accent: "#359aff", venue: "ธันเดอร์โดม เมืองทองธานี", price: 1200 },
  { id: "p3", title: "LING ORM", subtitle: "1st Fan Concert", date: "22 ส.ค. 2026", gradient: ["#e85d9c", "#7b2ff7"], image: "/image/card3.jpg", accent: "#e85d9c", venue: "พารากอน ฮอลล์", price: 1500 },
  { id: "p4", title: "THE DREAMER", subtitle: "Live in Bangkok", date: "12 ก.ย. 2026", gradient: ["#ff7a59", "#c81d77"], image: "/image/card4.png", accent: "#ff7a59", venue: "ยูเนี่ยน ฮอลล์", price: 990 },
  { id: "p5", title: "WINTER SEASON", subtitle: "Final Concert", date: "4 ต.ค. 2026", gradient: ["#1e2a44", "#0a0e1a"], image: "/image/card5.png", accent: "#6a8cff", venue: "รอยัล พารากอน ฮอลล์", price: 1800 },
  { id: "p6", title: "PANTO MIME", subtitle: "in Wonder", date: "8 ส.ค. 2026", gradient: ["#ff4d8d", "#ffb347"], accent: "#ff4d8d", venue: "หอประชุมใหญ่ ศูนย์วัฒนธรรม", price: 800 },
  { id: "p7", title: "NEON NIGHTS", subtitle: "World Tour", date: "19 ต.ค. 2026", gradient: ["#00c2a8", "#1a3a6b"], accent: "#00c2a8", venue: "อิมแพค เอ็กซิบิชั่น ฮอลล์", price: 2200 },
];

export const ALL_POSTERS = POSTERS;

export function getPosterById(id: string): PosterEvent | undefined {
  return POSTERS.find((poster) => poster.id === id);
}

export const SECTIONS: { title: string; events: PosterEvent[] }[] = [
  { title: "กำลังมาแรง", events: POSTERS },
  { title: "ใหม่ล่าสุด", events: [...POSTERS.slice(2), ...POSTERS.slice(0, 2)] },
  { title: "ละครเวที", events: [...POSTERS.slice(4), ...POSTERS.slice(0, 4)] },
];

export const HERO_SLIDES: {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  gradient: [string, string];
}[] = [
  {
    id: "h1",
    eyebrow: "Dime! x KKP",
    title: "เปิดประตูสู่ตลาดหุ้นสหรัฐฯ\nเพื่อลูกของคุณ ด้วย",
    highlight: "“บัญชีเสริม”",
    gradient: ["#a8e063", "#8e6bff"],
  },
  {
    id: "h2",
    eyebrow: "AI Matching",
    title: "จองตั๋วง่ายด้วย AI\nไม่พลาดทุกโอกาสใหม่ๆ",
    highlight: "#ไม่พลาดเทรนด์",
    gradient: ["#56ccf2", "#6a5af9"],
  },
  {
    id: "h3",
    eyebrow: "MSU x Hackathon",
    title: "ตั๋วเด็ดขอนแก่น พร้อมแล้ว\nกดบัตรก่อนใคร",
    highlight: "#วิศวคอมมข",
    gradient: ["#f857a6", "#ff5858"],
  },
];

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    badge: { label: "Exclusive", tone: "exclusive" },
    headline: "เก็บตกภาพ พุฒ - พาเวล กับแฟนคอนครั้งแรก ยิ่งใหญ่ อบอุ่น งดงาม ประทับใจในทุกโมเมนต์",
    source: "iTiket News · 13 มิ.ย. 2026",
    gradient: ["#c81d77", "#1a0a2e"],
  },
  {
    id: "n2",
    badge: { label: "นักแสดง", tone: "hot" },
    headline: "“จูเนียร์-มาร์ค” พร้อมมอบความสุขให้แฟนๆ ฮอบยกฮอลล์ คอนเสิร์ตครั้งใหญ่ เตรียมกดบัตรพรุ่งนี้ 13 มิ.ย.",
    source: "iTiket News · 12 มิ.ย. 2026",
    gradient: ["#2f80ed", "#56ccf2"],
  },
  {
    id: "n3",
    badge: { label: "นักแสดง", tone: "hot" },
    headline: "“จูเนียร์-มาร์ค” พร้อมมอบความสุขให้แฟนๆ ฮอบยกฮอลล์ คอนเสิร์ตครั้งใหญ่ เตรียมกดบัตรพรุ่งนี้ 13 มิ.ย.",
    source: "iTiket News · 12 มิ.ย. 2026",
    gradient: ["#11998e", "#38ef7d"],
  },
  {
    id: "n4",
    badge: { label: "Exclusive", tone: "exclusive" },
    headline: "เปิดวาร์ปศิลปินหน้าใหม่ มาแรงแซงทุกโค้ง เตรียมจัดคอนเสิร์ตเดี่ยวครั้งแรกปลายปีนี้",
    source: "iTiket News · 11 มิ.ย. 2026",
    gradient: ["#7b2ff7", "#f107a3"],
  },
];
