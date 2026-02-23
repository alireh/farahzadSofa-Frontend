import React from "react";
import { useEffect, useState } from "react";
import "../style2/modal.css";

interface MenuItem {
  id: number;
  title: string;
  url: string;
  order_index: number;
}

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
const [editTitle, setEditTitle] = useState<string>("");
  if (!open) return null;
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;