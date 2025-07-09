import { useState, useEffect, useRef } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { FaMagic } from "react-icons/fa";
import toast from "react-hot-toast";
import EditTaskModal from "./EditTask";
import "../styles/taskCard.css";
import "../styles/animation.css";

const TaskCard = ({
  _id,
  title,
  description,
  priority,
  assignedTo,
  onDragStart,
  onDelete,
  onSmartAssign,
  lastModified,
  onUpdate,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDelete(id);
      toast.success("Task deleted", {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#0f172a",
          color: "#f8fafc",
          fontSize: "14px",
          padding: "10px 14px",
          borderRadius: "8px",
        },
      });
    }
  };


  const getPriorityClass = () => {
    switch (priority?.toLowerCase()) {
      case "high": return "priority-badge high";
      case "medium": return "priority-badge medium";
      case "low": return "priority-badge low";
      default: return "priority-badge";
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  return (
    <>
      <div
        className={`task-card animated-card ${isDragging ? "dragging" : ""}`}
        draggable
        onDragStart={(e) => {
          setIsDragging(true);
          onDragStart(e, { _id, title, description, priority, assignedTo, lastModified });
        }}
        onDragEnd={() => setIsDragging(false)}
      >
        <div
          className="priority-indicator"

          style={{ backgroundColor: getPriorityColor() }}
        ></div>

        <div className="task-options top-right" ref={menuRef}>
          <FiMoreVertical
            className="more-icon"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="options-dropdown">
              <p onClick={() => setShowEditModal(true)}>Edit</p>
              <p onClick={() => handleDelete(_id)}>Delete</p>
            </div>
          )}
        </div>

        <div className="card-content">
          <h4>{title}</h4>
          <p>{description}</p>

        </div>

        <div className="card-footer centered-footer">
          <div className="footer-item">
            <span className={getPriorityClass()}>{priority}</span>
          </div>
          <div
            className="footer-item tooltip smart-assign-icon"
            onClick={async () => {
              setAssigning(true);
              const updated = await onSmartAssign(_id);
              if (updated?.assignedTo?.name) {
                toast.success(`✨ Assigned to ${updated.assignedTo.name}`, {
                  position: "top-center",
                  duration: 2000,
                  style: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    fontSize: "14px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                  },
                });
              } else {
                toast.error("Smart assign failed or no assignee found");
              }
              setAssigning(false);
            }}
          >
            <FaMagic className={assigning ? "magic-assign-anim" : ""} />
            <span className="tooltip-text">✨ Smart Assign</span>
          </div>
          <div className="footer-item assignee-avatar">

            <div className="footer-item assignee-avatar">
              {assignedTo?.name
                ? assignedTo.name
                  .trim()
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
                : "?"}
            </div>

          </div>
        </div>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={{ _id, title, description, priority, lastModified }}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default TaskCard;





