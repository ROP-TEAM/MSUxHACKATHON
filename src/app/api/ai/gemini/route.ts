import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { buildAdminPrompt, buildUserPrompt } from "@/lib/ecommerce-data";

const model = "gemini-2.5-flash";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน .env.local จึงเรียก Gemini ไม่ได้" },
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

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return NextResponse.json({
      answer: response.text ?? "Gemini ไม่ได้ส่งข้อความกลับมา",
      model,
      role,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ไม่สามารถเรียก Gemini API ได้";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
