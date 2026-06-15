"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./AiPanel.module.scss";
import eventsJson from "@/data/events.json";

type Role = "user" | "admin";

type MatchedEvent = {
  event_id: string;
  title: string;
  date: string;
  location: string;
  ticket_price: number;
  imageUrl: string;
};

type Message = {
  role: "user" | "ai";
  text: string;
  isError?: boolean;
  retry?: string;
  events?: MatchedEvent[];
};

type Props = { role: Role; onClose?: () => void };

const BOOKING_KEYWORDS = /จอง|ซื้อ|ตั๋ว|โซน|ราคา|บัตร|เข้าร่วม|สมัคร|Event|event|คอนเสิร์ต/;

type RawEvent = { event_id: string; title: string; date: string; location: string; ticket_price: number };

const cardImages = [
  "/image/card1.jpg",
  "/image/card2.png",
  "/image/card3.jpg",
  "/image/card4.png",
  "/image/card5.png",
];

const THAI_MONTHS_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const CARD_DESC = "Lorem Ipsum is simply dummy text of the printing and typesetting ...";

function formatThaiDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${THAI_MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function detectBookingEvents(text: string): MatchedEvent[] {
  if (!BOOKING_KEYWORDS.test(text)) return [];

  const lowerText = text.toLowerCase();
  const mentioned = (eventsJson as RawEvent[]).filter((ev) =>
    lowerText.includes(ev.title.toLowerCase()),
  );

  return mentioned.map((ev, i) => ({
    event_id: ev.event_id,
    title: ev.title,
    date: formatThaiDate(ev.date),
    location: ev.location,
    ticket_price: ev.ticket_price,
    imageUrl: cardImages[i % cardImages.length],
  }));
}

const SUGGESTIONS: Record<Role, string[]> = {
  user: [
    "มี Event อะไรบ้างในปีนี้?",
    "คอนเสิร์ตจัดที่ไหน วันไหน?",
    "โซนนั่งมีอะไรบ้าง?",
    "ราคาตั๋วแต่ละ Event เป็นเท่าไร?",
  ],
  admin: [
    "สรุปยอดขายตั๋วรวมทั้งหมด",
    "Event ไหนขายได้กี่ใบ รอจ่ายกี่คน?",
    "มีตั๋วถูกยกเลิกกี่ใบ คิดเป็นเท่าไร?",
    "รายได้รวมทุก Event เท่าไร?",
  ],
};

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^`[^`]+`$/.test(part))
      return <code key={i} className={styles.inlineCode}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function renderMarkdown(text: string) {
  const segments: { type: "text" | "code"; content: string }[] = [];
  const cbRe = /```(?:\w+)?\n?([\s\S]*?)```/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = cbRe.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: "text", content: text.slice(last, m.index) });
    segments.push({ type: "code", content: m[1].trimEnd() });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: "text", content: text.slice(last) });

  return segments.map((seg, si) => {
    if (seg.type === "code") {
      return (
        <pre key={si} className={styles.codeBlock}>
          <code>{seg.content}</code>
        </pre>
      );
    }

    const lines = seg.content.split("\n");
    const result: React.ReactNode[] = [];
    let buf: { type: "ul" | "ol"; items: React.ReactNode[] } | null = null;

    const flush = (key: string) => {
      if (!buf) return;
      const Tag = buf.type;
      result.push(<Tag key={key} className={styles.msgList}>{buf.items}</Tag>);
      buf = null;
    };

    lines.forEach((line, li) => {
      const ul = line.match(/^[-*•]\s+(.*)/);
      const ol = line.match(/^\d+\.\s+(.*)/);
      const hd = line.match(/^#{1,3}\s+(.*)/);

      if (ul) {
        if (buf?.type === "ol") flush(`l${si}-${li}`);
        if (!buf) buf = { type: "ul", items: [] };
        buf.items.push(<li key={li}>{renderInline(ul[1])}</li>);
      } else if (ol) {
        if (buf?.type === "ul") flush(`l${si}-${li}`);
        if (!buf) buf = { type: "ol", items: [] };
        buf.items.push(<li key={li}>{renderInline(ol[1])}</li>);
      } else if (hd) {
        flush(`l${si}-${li}`);
        result.push(
          <strong key={`h${si}-${li}`} className={styles.msgHeading}>
            {renderInline(hd[1])}
          </strong>
        );
      } else if (line.trim() === "") {
        flush(`l${si}-${li}`);
        if (result.length > 0)
          result.push(<div key={`sp${si}-${li}`} className={styles.msgSpacer} />);
      } else {
        flush(`l${si}-${li}`);
        result.push(
          <span key={`ln${si}-${li}`} className={styles.msgLine}>
            {renderInline(line)}
          </span>
        );
      }
    });
    flush(`l${si}-end`);
    return <span key={si}>{result}</span>;
  });
}

export default function AiPanel({ role, onClose }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [prevRole, setPrevRole] = useState(role);
  if (role !== prevRole) {
    setPrevRole(role);
    setMessages([]);
    setInput("");
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, role }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: data.error ?? "ไม่สามารถเชื่อมต่อ AI ได้ในขณะนี้", isError: true, retry: q },
        ]);
        return;
      }
      const aiText: string = data.answer ?? "ไม่ได้รับคำตอบ";
      const events = role === "user" ? detectBookingEvents(aiText) : undefined;
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: aiText, events },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", isError: true, retry: q },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleActionClick(href: string) {
    onClose?.();
    router.push(href);
  }

  return (
    <aside className={styles.panel} data-role={role}>
      {messages.length === 0 && (
        <div className={styles.header}>
          <span className={styles.icon}>
            <Image src="/logo/msuLogo.svg" alt="" width={16} height={20} />
          </span>
          <h2 className={styles.title}>แชทบอท</h2>
          <p className={styles.subtitle}>
            แชทบอทสามารถตอบกลับผิดพลาดได้ กรุณาเช็คความถูกต้อง
          </p>
        </div>
      )}

      <div className={styles.body}>
        {messages.length === 0 ? (
          <div className={styles.suggestions}>
            <p className={styles.suggestLabel}>ลองถาม</p>
            {SUGGESTIONS[role].map((s) => (
              <button type="button" key={s} className={styles.chip} onClick={() => send(s)}>
                <span className={styles.chipIcon}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M3 2h10a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 13 12H6.5L3.5 14.5V12H3a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 3 2Z"/>
                  </svg>
                </span>
                <span>{s}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.chat}>
            {messages.map((msg, i) => (
              msg.role === "user" ? (
                <div key={i} className={styles.userMsg}>
                  <p>{msg.text}</p>
                </div>
              ) : msg.isError ? (
                <div key={i} className={styles.errorCard}>
                  <span className={styles.errorIcon}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="10" cy="14" r="0.9" fill="currentColor" />
                    </svg>
                  </span>
                  <div className={styles.errorBody}>
                    <strong className={styles.errorTitle}>เกิดข้อผิดพลาด</strong>
                    <p className={styles.errorText}>{msg.text}</p>
                    {msg.retry && (
                      <button
                        type="button"
                        className={styles.retryBtn}
                        onClick={() => send(msg.retry as string)}
                        disabled={loading}
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M13 8a5 5 0 1 1-1.46-3.54M13 2.5V5h-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        ลองอีกครั้ง
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div key={i} className={styles.aiMsg}>
                  <div className={styles.aiContent}>
                    {renderMarkdown(msg.text)}
                    {msg.events && msg.events.length > 0 && (
                      <div className={styles.eventCards}>
                        {msg.events.map((ev) => (
                          <div
                            key={ev.event_id}
                            className={styles.eventCard}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleActionClick(`/events/${ev.event_id}`)}
                            onKeyDown={(e) => e.key === "Enter" && handleActionClick(`/events/${ev.event_id}`)}
                          >
                            <img src={ev.imageUrl} alt={ev.title} className={styles.eventCardImg} />
                            <div className={styles.eventCardBody}>
                              <strong className={styles.eventCardTitle}>{ev.title}</strong>
                              <p className={styles.eventCardDesc}>{CARD_DESC}</p>
                              <div className={styles.eventCardMeta}>
                                <span className={styles.metaItem}>
                                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                                    <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                  </svg>
                                  {ev.date}
                                </span>
                                <span className={styles.metaItem}>
                                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                                    <path d="M3.5 13c0-2.2 2-3.8 4.5-3.8s4.5 1.6 4.5 3.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                  </svg>
                                  {ev.location}
                                </span>
                                <span className={styles.eventCardPrice}>
                                  {ev.ticket_price === 0 ? "ฟรี" : `${ev.ticket_price.toLocaleString("th-TH")} บาท`}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
            {loading && (
              <div className={styles.aiMsg}>
                <div className={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <input
          className={styles.input}
          placeholder={
            role === "admin"
              ? "ถามเกี่ยวกับยอดขาย / สถิติ…"
              : "ถามเกี่ยวกับ Event และตั๋ว…"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          disabled={loading}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          aria-label="ส่ง"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8h10M8 3.5L12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
