import { notFound } from "next/navigation";
import { getPosterById } from "@/components/home/homeData";
import EventDetailClient from "./EventDetailClient";

const DESCRIPTION =
  "จองบัตรเข้าชมงานได้อย่างสะดวกและรวดเร็วผ่านระบบออนไลน์ เพียงเลือกโซนที่นั่งที่ต้องการ " +
  "ตรวจสอบราคาและจำนวนที่นั่งคงเหลือแบบเรียลไทม์ ก่อนดำเนินการชำระเงินผ่านช่องทางที่ปลอดภัย " +
  "หลังจากยืนยันการสั่งซื้อสำเร็จ ระบบจะจัดส่ง E-Ticket ไปยังอีเมลและบัญชีของท่านโดยอัตโนมัติ " +
  "สามารถนำบัตรอิเล็กทรอนิกส์ไปแสดงที่หน้างานเพื่อสแกนเข้าร่วมกิจกรรมได้ทันที " +
  "โดยไม่ต้องพิมพ์บัตรหรือต่อแถวรับบัตรล่วงหน้าให้เสียเวลา";

type Props = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = getPosterById(id);

  if (!event) notFound();

  return <EventDetailClient event={event} eventId={id} description={DESCRIPTION} />;
}
