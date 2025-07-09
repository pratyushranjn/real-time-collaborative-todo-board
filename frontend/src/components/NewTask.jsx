import { useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import socket from "../services/socket";
import toast from "react-hot-toast";
import "../styles/NewTask.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


const NewTaskModal = ({ isOpen, onClose, boardId }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.body.classList.remove("modal-open");
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const task = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      boardId,
    };

    try {
      const { data: createdTask } = await axios.post(
        `${BASE_URL}/tasks/createTask`,
        task,
        { withCredentials: true }
      );
      socket.emit("taskCreated", createdTask);
      toast.success("Task created successfully");
      onClose();
    } catch (err) {
      console.error("Failed to create task", err);
      const msg =
        err?.response?.data?.message || "Failed to create task. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close Modal">
            <IoClose size={24} />
          </button>
        </div>
        <p className="modal-subtext">
          Add a new task to your board. Click add task when you're done.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Develop new feature"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Add description for the task."
            rows="3"
          />

          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" required>
            <option value="">Select Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
