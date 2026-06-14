import { ReactNode } from "react";

export interface ModalProps {
  children: ReactNode;
  isActive: boolean;
  onClose: () => void;
  marginTop?: string;
}
