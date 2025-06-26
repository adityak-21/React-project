import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import "../style/RegisterModal.css";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default function RegisterModal({ trigger }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {trigger({ onClick: () => setOpen(true) })}
      <Modal open={open} onClose={() => setOpen(false)}>
        <RegisterForm isModal={true} />
      </Modal>
    </>
  );
}
