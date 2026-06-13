"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AiPanel.module.scss";

type Role = "user" | "admin";

type Message = {
  role: "user" | "ai";
  text: string;
};

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

type Props = {
  role: Role;
};

export default function AiPanel({ role }: Props) {
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
  }, [messages]);

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
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer ?? data.error ?? "ไม่ได้รับคำตอบ" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className={styles.panel} data-role={role}>
      <div className={styles.header}>
        <span className={styles.icon}>{role === "admin" ? "⬡" : "✦"}</span>
        <div>
          <h2 className={styles.title}>
            {role === "admin" ? "Admin AI" : "Hi, I'm Gemini!"}
          </h2>
          <p className={styles.subtitle}>
            {role === "admin"
              ? "วิเคราะห์ภาพรวม Event & ยอดขาย"
              : "AI ช่วยตอบคำถามเกี่ยวกับ Event"}
          </p>
        </div>
        <span className={styles.badge}>{ROLE_LABEL[role]}</span>
      </div>

      <div className={styles.body}>
        {messages.length === 0 ? (
          <div className={styles.suggestions}>
            <p className={styles.suggestLabel}>ลองถาม:</p>
            {SUGGESTIONS[role].map((s) => (
              <button key={s} className={styles.chip} onClick={() => send(s)}>
                <span className={styles.chipIcon}>💬</span>
                <span>{s}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.chat}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? styles.userMsg : styles.aiMsg}
              >
                {m.role === "ai" && (
                  <span className={styles.aiDot}>
                    {role === "admin" ? "⬡" : "✦"}
                  </span>
                )}
                <p>{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className={styles.aiMsg}>
                <span className={styles.aiDot}>
                  {role === "admin" ? "⬡" : "✦"}
                </span>
                <p className={styles.typing}>กำลังคิด…</p>
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
          className={styles.sendBtn}
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          aria-label="ส่ง"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8h10M8 3.5L12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
