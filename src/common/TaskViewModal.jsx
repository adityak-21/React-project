import React from "react";
import "../style/TaskListing.css";

const fieldNames = {
  id: "Task ID",
  title: "Title",
  description: "Description",
  created_by: "Created By",
  assignee: "Assignee",
  due_date: "Due Date",
  status: "Status",
  created_at: "Created At",
  updated_at: "Updated At",
};

export default function TaskViewModal({ open, task, onClose }) {
  if (!open || !task) return null;

  return (
    <div className="task-modal-overlay">
      <div className="task-modal-content">
        <button className="task-modal-close" onClick={onClose} title="Close">
          &times;
        </button>
        <h2 className="task-modal-title">Task Details</h2>
        <div className="task-modal-fields">
          {Object.keys(fieldNames).map((key) => (
            <div className="task-modal-field" key={key}>
              <span className="task-modal-label">{fieldNames[key]}</span>
              <span className="task-modal-value">{task[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
