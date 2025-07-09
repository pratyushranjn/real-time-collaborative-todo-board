import { createContext, useContext, useEffect, useState } from "react";
import socket from "../services/socket";
import api from "../services/api";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks", { withCredentials: true });
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  // Filter tasks by priority
  const filteredTasks = priorityFilter === "All"
    ? tasks
    : tasks.filter(task => task.priority === priorityFilter);

  useEffect(() => {
    fetchTasks();

    // Live sync
    socket.on("taskCreated", (newTask) => {
      setTasks(prev => [...prev, newTask]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks(prev =>
        prev.map(task => task._id === updatedTask._id ? updatedTask : task)
      );
    });

    socket.on("taskDeleted", ({ id }) => {
      setTasks(prev => prev.filter(task => task._id !== id));
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  return (
    <BoardContext.Provider value={{
      tasks: filteredTasks,
      setTasks,
      priorityFilter,
      setPriorityFilter
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);


