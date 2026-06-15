import { NextResponse } from "next/server";
import { buildAdminPrompt, buildUserPrompt } from "@/lib/ecommerce-data";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ยังไม่ได้ตั้งค่า DEEPSEEK_API_KEY ใน .env.local จึงเรียก DeepSeek ไม่ได้" },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    question?: unknown;
    role?: unknown;
  } | null;

  const question =
    typeof body?.question === "string" && body.question.trim().length > 0
      ? body.question.trim()
      : "ช่วยวิเคราะห์ข้อมูลและแนะนำ action ที่ควรทำ";

  const role = body?.role === "admin" ? "admin" : "user";
  const prompt = role === "admin"
    ? buildAdminPrompt(question)
    : buildUserPrompt(question);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      return NextResponse.json(
        { error: `DeepSeek API error (${response.status}): ${errBody}` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ?? "DeepSeek ไม่ได้ส่งข้อความกลับมา";

    return NextResponse.json({ answer, model: MODEL, role });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ไม่สามารถเรียก DeepSeek API ได้";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
