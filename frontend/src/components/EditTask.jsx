import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/EditTask.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EditTaskModal = ({ task, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        priority: task.priority,
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.put(
                `${BASE_URL}/tasks/${task._id}`,
                {
                    ...formData,
                    lastModified: task.lastModified,
                },
                { withCredentials: true }  
            );


            onUpdate(res.data);
            toast.success("Task updated");
            onClose();
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error("Conflict: Task was modified elsewhere.");
                console.log("Server:", err.response.data.serverVersion);
                console.log("Client:", err.response.data.clientVersion);
            } else if (err.response?.status === 401) {
                toast.error("Unauthorized. Please login again.");
            } else {
                toast.error("Update failed");
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Task</h2>
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <label>Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                />

                <label>Priority</label>
                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>

                <div className="modal-buttons">
                    <button className="save-btn" onClick={handleSubmit}>
                        Save
                    </button>
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
