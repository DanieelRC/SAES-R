import React from "react";
import { createPortal } from "react-dom";
import "./ModalPDF.css";

export default function ModalPDF({ open, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="pdfModal-overlay" role="dialog" aria-modal="true">
      <div className="pdfModal-box">
        <button className="pdfModal-close" onClick={onClose} aria-label="Cerrar">✖</button>

        <div className="pdfModal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
