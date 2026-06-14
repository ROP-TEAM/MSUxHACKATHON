export type NewsItem = {
  id: string;
  badge: { label: string; tone: "exclusive" | "hot" };
  headline: string;
  source: string;
  gradient: [string, string];
};

export const HERO_SLIDES: {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  gradient: [string, string];
  image: string;
}[] = [
  {
    id: "h1",
    eyebrow: "Dime! x KKP",
    title: "เปิดประตูสู่ตลาดหุ้นสหรัฐฯ\nเพื่อลูกของคุณ ด้วย",
    highlight: "“บัญชีเสริม”",
    gradient: ["#a8e063", "#8e6bff"],
    image: "/image/poster1.png",
  },
  {
    id: "h2",
    eyebrow: "AI Matching",
    title: "จองตั๋วง่ายด้วย AI\nไม่พลาดทุกโอกาสใหม่ๆ",
    highlight: "#ไม่พลาดเทรนด์",
    gradient: ["#56ccf2", "#6a5af9"],
    image: "/image/poster2.png",
  },
  {
    id: "h3",
    eyebrow: "MSU x Hackathon",
    title: "ตั๋วเด็ดขอนแก่น พร้อมแล้ว\nกดบัตรก่อนใคร",
    highlight: "#วิศวคอมมข",
    gradient: ["#f857a6", "#ff5858"],
    image: "/image/poster3.png",
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
