import React, { useState } from "react";
import "../style/Tooltip.css";

export const Tooltip = ({ children, text, className }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className={`tooltip-wrapper ${className || ""}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <span className="tooltip-box">{text}</span>}
    </span>
  );
};
