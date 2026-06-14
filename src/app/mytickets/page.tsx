"use client";

import { useState } from "react";
import styles from "./mytickets.module.scss";
import Image from "next/image";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import IconSvgMono from "@/components/icon/SvgIcon";

const MyTicket = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTicketSrc, setSelectedTicketSrc] = useState<string | null>(
    null,
  );

  const tickets = [
    { id: 1, src: "/tickets/01.png", alt: "tickets-01" },
    { id: 2, src: "/tickets/02.png", alt: "tickets-02" },
  ];

  const handleTicketClick = (src: string) => {
    setSelectedTicketSrc(src);
    open();
  };

  const handleDownload = async () => {
    if (!selectedTicketSrc) return;
    try {
      const response = await fetch(selectedTicketSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedTicketSrc.split("/").pop() || "ticket.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async () => {
    if (!selectedTicketSrc) return;
    try {
      const fullUrl = `${window.location.origin}${selectedTicketSrc}`;
      await navigator.clipboard.writeText(fullUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.mytickets}>
      <h2 className={styles.mytickets_title}>ตั๋วของฉัน</h2>

      <div className={styles.tickets_container}>
        {tickets.map((ticket) => (
          <Image
            key={ticket.id}
            className={styles.tickets_image}
            src={ticket.src}
            width={1000}
            height={1000}
            alt={ticket.alt}
            onClick={() => handleTicketClick(ticket.src)}
            style={{ cursor: "pointer" }}
          />
        ))}
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
          body: {
            padding: 0,
            overflow: "visible",
          },
        }}
      >
        {selectedTicketSrc && (
          <div className={styles.modal_ticket_wrapper}>
            <div className={styles.modal_ticket_title}>
              <h2 className={styles.modal_ticket_name}>
                Drive-To-Blue-Concert-120607
              </h2>
              <div className={styles.modal_tiket_icon}>
                <div onClick={handleDownload} style={{ cursor: "pointer" }}>
                  <IconSvgMono
                    src="/icon/download.svg"
                    alt="download"
                  ></IconSvgMono>
                </div>
                <div onClick={handleShare} style={{ cursor: "pointer" }}>
                  <IconSvgMono src="/icon/share.svg" alt="share"></IconSvgMono>
                </div>
              </div>
            </div>
            <Image
              src={selectedTicketSrc}
              width={800}
              height={800}
              alt="Selected Ticket"
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyTicket;
