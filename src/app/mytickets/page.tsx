"use client";

import { useState, useSyncExternalStore } from "react";
import styles from "./mytickets.module.scss";
import Image from "next/image";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import IconSvgMono from "@/components/icon/SvgIcon";
import TicketCard from "@/components/TicketCard/TicketCard";
import { simulationStore } from "@/lib/simulation-store";
import { userStore } from "@/lib/user-store";

const MyTicket = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const userId = useSyncExternalStore(
    userStore.subscribe,
    () => userStore.getCurrentUserId(),
    () => "u001",
  );

  const mergedTickets = useSyncExternalStore(
    simulationStore.subscribeMerged,
    () => simulationStore.getMergedSnapshot(),
    () => simulationStore.getMergedServerSnapshot(),
  );

  const tickets = mergedTickets.filter((t) => t.user_id === userId);

  const selectedTicket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId)
    : null;

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    open();
  };

  const handleDownload = () => {
    alert("ระบบจะดาวน์โหลด E-Ticket ในเวอร์ชันจริง");
  };

  const handleShare = async () => {
    if (!selectedTicketId) return;
    try {
      const fullUrl = `${window.location.origin}/mytickets/${selectedTicketId}`;
      await navigator.clipboard.writeText(fullUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#5AB502",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
          <rect
            width="100%"
            height="100%"
            fill="white"
            opacity="0.18"
            filter="url(#grain)"
          />
          <rect
            width="100%"
            height="100%"
            fill="black"
            opacity="0.12"
            filter="url(#grain)"
          />
        </svg>
        <Image
          style={{ width: "400px", height: "auto", display: "block" }}
          src={"/image/background3.svg"}
          width={400}
          height={200}
          alt="backgroud"
        />
      </div>

      <div className={styles.mytickets}>
        <h2 className={styles.mytickets_title}>ตั๋วของฉัน</h2>

        <div className={styles.tickets_container}>
          {tickets.length === 0 ? (
            <p className={styles.empty}>ไม่พบตั๋ว</p>
          ) : (
            tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => handleTicketClick(ticket.id)}
              />
            ))
          )}
        </div>

        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          centered
          size="auto"
          styles={{
            content: {
              backgroundColor: "transparent",
              boxShadow: "none",
              overflow: "visible",
            },
            body: { padding: 0, overflow: "visible" },
          }}
        >
          {selectedTicket && (
            <div className={styles.modal_ticket_wrapper}>
              <div className={styles.modal_ticket_title}>
                <h2 className={styles.modal_ticket_name}>
                  {selectedTicket.eventTitle}
                </h2>
                <div className={styles.modal_tiket_icon}>
                  <div onClick={handleDownload}>
                    <IconSvgMono src="/icon/download.svg" alt="download" />
                  </div>
                  <div onClick={handleShare}>
                    <IconSvgMono src="/icon/share.svg" alt="share" />
                  </div>
                </div>
              </div>

              <TicketCard ticket={selectedTicket} variant="modal" />

              {(selectedTicket.status === "RESERVED" ||
                selectedTicket.status === "PAID") && (
                <button
                  type="button"
                  className={styles.cancel_btn}
                  onClick={() => {
                    simulationStore.cancelTicket(selectedTicket.id);
                    close();
                  }}
                >
                  ยกเลิกบัตรนี้
                </button>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MyTicket;
