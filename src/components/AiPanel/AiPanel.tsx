"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function formatThaiDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${THAI_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear() + 543}`;
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

const ROLE_LABEL: Record<Role, string> = {
  user: "ผู้ใช้ทั่วไป",
  admin: "แอดมิน",
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

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [role]);

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
      const aiText: string = data.answer ?? data.error ?? "ไม่ได้รับคำตอบ";
      const events = role === "user" ? detectBookingEvents(aiText) : undefined;
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: aiText, events },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleActionClick(href: string) {
    onClose?.();
    router.push(href);
  }

  const aiIcon = role === "admin" ? "⬡" : "✦";

  return (
    <aside className={styles.panel} data-role={role}>
      <div className={styles.header}>
        <span className={styles.icon}>{aiIcon}</span>
        <div className={styles.headerText}>
          <h2 className={styles.title}>
            {role === "admin" ? "Admin AI" : "Hi, I'm Gemini!"}
          </h2>
          <p className={styles.subtitle}>
            {role === "admin"
              ? "วิเคราะห์ภาพรวม Event & ยอดขาย"
              : "AI ช่วยตอบคำถามเกี่ยวกับ Event"}
          </p>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.badge}>{ROLE_LABEL[role]}</span>
          {messages.length > 0 && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => { setMessages([]); setInput(""); }}
              aria-label="ล้างการสนทนา"
              title="ล้างการสนทนา"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.body}>
        {messages.length === 0 ? (
          <div className={styles.suggestions}>
            <p className={styles.suggestLabel}>ลองถาม</p>
            {SUGGESTIONS[role].map((s) => (
              <button type="button" key={s} className={styles.chip} onClick={() => send(s)}>
                <svg className={styles.chipIcon} width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M6.5 1.5L7.9 5.3H11.8L8.7 7.6L10.1 11.4L6.5 9.1L2.9 11.4L4.3 7.6L1.2 5.3H5.1L6.5 1.5Z" fill="currentColor"/>
                </svg>
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
              ) : (
                <div key={i} className={`${styles.aiMsg}${msg.isError ? ` ${styles.aiMsgError}` : ""}`}>
                  <span className={styles.aiDot}>{aiIcon}</span>
                  <div className={styles.aiContent}>
                    {renderMarkdown(msg.text)}
                    {msg.events && msg.events.length > 0 && (
                      <div className={styles.eventCards}>
                        {msg.events.map((ev) => (
                          <div key={ev.event_id} className={styles.eventCard}>
                            <img src={ev.imageUrl} alt={ev.title} className={styles.eventCardImg} />
                            <div className={styles.eventCardInfo}>
                              <strong>{ev.title}</strong>
                              <span>{ev.date} · {ev.location}</span>
                              <span>{ev.ticket_price === 0 ? "ฟรี" : `฿${ev.ticket_price.toLocaleString("th-TH")}`}</span>
                            </div>
                            <button
                              type="button"
                              className={styles.eventCardBtn}
                              onClick={() => handleActionClick(`/events/${ev.event_id}`)}
                            >
                              จอง
                            </button>
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
                <span className={styles.aiDot}>{aiIcon}</span>
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
