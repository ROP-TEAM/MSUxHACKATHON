import React, { useRef } from "react";
import styles from "./Modal.module.scss";
import { ModalProps } from "./Modal.types";
import { useClickOutSide } from "@/components/hook/useClickOutSide";


export const Modal = ({
  children,
  isActive,
  marginTop = "10rem",
  onClose,
}: ModalProps) => {
  const contentRef = useClickOutSide<HTMLDivElement>(() => onClose());

  if (!isActive) return;
  return (
    <div className={styles.background}>
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{ "--margin-Top": marginTop } as React.CSSProperties}
        className={styles.modal}
      >
        {children}
      </div>
    </div>
  );
};
