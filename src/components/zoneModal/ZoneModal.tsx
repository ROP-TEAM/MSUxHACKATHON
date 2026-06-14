"use client";

import React, { useState, useEffect } from "react";
import styles from "./ZoneModal.module.scss";
import { Modal } from "../ui/Modal/Modal";
import StageOverview from "@/components/StageOverview/StageOverview";
import { Select, TextInput } from "@mantine/core";
import Image from "next/image";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface ZoneModalProps {
  isActive: boolean;
  onClose: () => void;
  zoneId: string | null;
  eventId: string;
  eventTitle: string;
  onViewDetails?: (zoneId: string) => void;
}

const stepIcon = <Image src="/icon/logo.svg" alt="" width={30} height={30} />;
const ZONE_LABEL: Record<string, string> = {
  Standing: "Standing Floor",
  A: "Zone A — 2F",
  B: "Zone B — 1F",
  C: "Zone C",
  D: "Zone D",
};

const ZONE_COLOR: Record<string, string> = {
  Standing: "#f03e3e",
  A: "#7CD227",
  B: "#7CD227",
  C: "#e8590c",
  D: "#862e9c",
};

export function ZoneModal({
  isActive,
  onClose,
  zoneId,
  eventId,
  eventTitle,
}: ZoneModalProps) {
  const [currentZone, setCurrentZone] = useState<string | null>(zoneId);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [seatZone, setSeatZone] = useState("");
  const [selectedGift, setSelectedGift] = useState("banner");
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const router = useRouter();

  const gifts = [
    {
      id: "banner",
      label: "ป้ายไฟนุ่มนิ่มติดเต็ด",
    },
    {
      id: "poster-a",
      label: "โปสเตอร์รูปแบบ A",
    },
    {
      id: "poster-b",
      label: "โปสเตอร์รูปแบบ B",
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      imageUrl: "/icon/payment1.svg",
      text: "PromptPay",
    },
    {
      id: 2,
      imageUrl: "/icon/payment2.svg",
      text: "Debit Card",
    },
    {
      id: 3,
      imageUrl: "/icon/payment3.svg",
      text: "จ่ายเงินสด",
    },
  ];

  useEffect(() => {
    setCurrentZone(zoneId);
    setCurrentBlockId(null);
  }, [zoneId]);

  if (!currentZone) return null;

  const label = ZONE_LABEL[currentZone] ?? `Zone ${currentZone}`;
  const color = ZONE_COLOR[currentZone] ?? "#495057";
  const blockNumber = currentBlockId ? currentBlockId.split("-")[1] : null;

  const handleZoneClick = (zone: string, blockId?: string | null) => {
    setCurrentZone(zone);
    setCurrentBlockId(blockId ?? null);

    const zoneText = blockId
      ? `${zone} - Block ${blockId.split("-")[1]}`
      : zone;

    setSeatZone(zoneText);
  };
  return (
    <Modal isActive={isActive} onClose={onClose}>
      <div className={styles.container}>
        <button className={styles.floatingClose} onClick={onClose}>
          ✕
        </button>
        {/* left panel - stage map */}
        <div
          className={styles.leftPanel}
          onClick={() => setMobileExpanded(false)}
        >
          <StageOverview
            eventId={eventId}
            selectedZone={currentZone}
            selectedBlockId={currentBlockId}
            tooltipMode="selection"
            onZoneClick={(zoneId: string, blockId?: string) =>
              handleZoneClick(zoneId, blockId)
            }
          />
        </div>

        {/* right panel - info */}
        <div
          className={`${styles.rightPanel} ${
            mobileExpanded ? styles.expanded : styles.collapsed
          }`}
        >
          <div
  className={styles.sheetHandle}
  onClick={() => setMobileExpanded(prev => !prev)}
/>
          <div>
            <div className={styles.sheetContent}>
              <div className={styles.topBar}>
                <div className={styles.stepperWrapper}>
                  <div className={styles.stepper}>
                    {[1, 2, 3].map((step, index) => (
                      <React.Fragment key={step}>
                        <button
                          className={
                            activeStep === step
                              ? styles.activeStep
                              : step < activeStep
                                ? styles.completedStep
                                : styles.pendingStep
                          }
                          onClick={() => setActiveStep(step)}
                        >
                          {activeStep === step && (
                            <Image
                              src="/icon/logo.svg"
                              alt="step"
                              width={15}
                              height={15}
                            />
                          )}
                        </button>

                        {index < 2 && (
                          <div
                            className={
                              step < activeStep
                                ? styles.activeLine
                                : styles.pendingLine
                            }
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <button
                  className={styles.closeBtn}
                  onClick={onClose}
                  aria-label="ปิด"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="1.3"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {activeStep === 1 && (
                <div className={styles.form}>
                  <h1>ซื้อบัตร {eventTitle}</h1>

                  <Select
                    label="เลือกวันที่"
                    placeholder="ยังไม่ได้เลือกวันที่"
                    data={[
                      {
                        value: "2026-06-20",
                        label: "20 มิถุนายน 2569",
                      },
                      {
                        value: "2026-06-21",
                        label: "21 มิถุนายน 2569",
                      },
                      {
                        value: "2026-06-22",
                        label: "22 มิถุนายน 2569",
                      },
                    ]}
                    value={selectedDate}
                    onChange={setSelectedDate}
                    variant="unstyled"
                    classNames={{
                      input: styles.materialInput,
                      label: styles.materialLabel,
                    }}
                    rightSection={<IconChevronDown size={25} />}
                  />

                  <TextInput
                    mt="xl"
                    label="เลือกโซนที่นั่ง"
                    placeholder="พิมพ์หรือคลิกที่แผนผัง"
                    value={seatZone}
                    onChange={(e) => setSeatZone(e.currentTarget.value)}
                    variant="unstyled"
                    classNames={{
                      input: styles.materialInput,
                      label: styles.materialLabel,
                    }}
                  />

                  <div className={styles.giftSection}>
                    <h3>เลือกของแถม</h3>

                    <div className={styles.giftList}>
                      {gifts.map((gift) => (
                        <button
                          key={gift.id}
                          type="button"
                          className={`${styles.giftItem} ${
                            selectedGift === gift.id ? styles.selected : ""
                          }`}
                          onClick={() => setSelectedGift(gift.id)}
                        >
                          {gift.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 2 && (
                <div className={styles.form}>
                  <h1>ช่องทางการชำระเงิน</h1>
                  <div className={styles.paymentList}>
                    {paymentMethods.map((item) => (
                      <button
                        key={item.id}
                        className={styles.paymentItem}
                        onClick={() => console.log(item.text)}
                      >
                        <div className={styles.left}>
                          <Image
                            src={item.imageUrl}
                            alt={item.text}
                            width={40}
                            height={40}
                          />

                          <span>{item.text}</span>
                        </div>

                        <IconArrowRight
                          className={styles.arrow}
                          size={25}
                          stroke={1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className={styles.share}>
                  <Image
                    src="/icon/bill.svg"
                    alt="bill"
                    width={250}
                    height={250}
                  />
                  <h1>ชำระเงินเสร็จสิ้น</h1>
                  <p>
                    ขอบคุณสำหรับการสั่งซื้อบัตรเข้าชมของคุณ <br></br>
                    ระบบได้บันทึกรายการและยืนยันการจองเรียบร้อย
                    สามารถตรวจสอบรายละเอียดบัตรของคุณภายในระบบ
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.stepActions}>
            {activeStep == 2 && (
              <button
                className={styles.secondaryBtn}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                <IconChevronLeft size={30} />
              </button>
            )}

            {activeStep < 3 ? (
              <button
                className={styles.navBtn}
                onClick={() => setActiveStep((prev) => prev + 1)}
              >
                ขั้นตอนต่อไป
              </button>
            ) : (
              <div className={styles.containerShare}>
                <button
                  className={styles.shareBtn}
                  onClick={() => router.push("/home")}
                >
                  แชร์กับเพื่อน
                </button>
                <p>ตรวจสอบข้อมูล</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
