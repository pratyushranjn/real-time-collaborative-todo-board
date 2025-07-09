import { useBoard } from "../context/BoardContext";
import useSmartAssign from "../hooks/useSmartAssign";
import TaskCard from "./TaskCard";
import socket from "../services/socket";
import api from "../services/api";

import '../styles/kanbanBoard.css'

const KanbanBoard = () => {
  const { tasks, setTasks } = useBoard(); // access both tasks and updater
  const { smartAssign } = useSmartAssign();

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "Todo"),
    inProgress: tasks.filter((t) => t.status === "In Progress"),
    done: tasks.filter((t) => t.status === "Done"),
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
  };

  const allowDrop = (e) => e.preventDefault();

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const draggedTask = JSON.parse(e.dataTransfer.getData("task"));

    const currentTask = tasks.find(t => t._id === draggedTask._id);
    if (!currentTask || currentTask.status === newStatus) return;

    const optimisticTask = { ...currentTask, status: newStatus };
    onUpdate(optimisticTask);

    try {
      const { data } = await api.put(`/tasks/${currentTask._id}`, {
        ...currentTask,
        status: newStatus,
        lastModified: currentTask.lastModified,
      });
      socket.emit("taskUpdated", data);
    } catch (err) {
      console.error("Drag-drop update failed", err);
    }
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      socket.emit("taskDeleted", { id });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const onUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  return (
    <div className="kanban-container">
      {Object.entries(groupedTasks).map(([key, cards]) => {
        const columnName =
          key === "todo"
            ? "To Do"
            : key === "inProgress"
              ? "In Progress"
              : "Done";
        const statusForDrop =
          key === "todo"
            ? "Todo"
            : key === "inProgress"
              ? "In Progress"
              : "Done";

        return (
          <div
            key={key}
            className="kanban-column"
            onDrop={(e) => handleDrop(e, statusForDrop)}
            onDragOver={allowDrop}
          >
            <div className="kanban-column-header">
              <h3 className="column-title">
                <span className={`status-dot ${key}`}></span>
                {columnName}
              </h3>
              <span className="count-badge">{cards.length}</span>
            </div>

            {cards.length === 0 ? (
              <div className="empty-message">
                <p>No tasks here yet 💤</p>
              </div>
            ) : (
              cards.map((task) => (
                <TaskCard
                  key={task._id}
                  {...task}
                  onDragStart={handleDragStart}
                  onDelete={onDelete}
                  onSmartAssign={smartAssign}
                  lastModified={task.lastModified}
                  onUpdate={onUpdate}
                />
              ))
            )}

          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
