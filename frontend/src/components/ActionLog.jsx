import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import socket from "../services/socket";
import "../styles/ActionLog.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  // Fetch recent logs
  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/log`, {
        withCredentials: true
      });
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    // Initial load
    fetchLogs();

    // Real-time updates via socket events
    socket.on("taskCreated", fetchLogs);
    socket.on("taskUpdated", fetchLogs);
    socket.on("taskDeleted", fetchLogs);
    socket.on("taskAssigned", fetchLogs); // Smart Assign


    // Clean up listeners
    return () => {
      socket.off("taskCreated", fetchLogs);
      socket.off("taskUpdated", fetchLogs);
      socket.off("taskDeleted", fetchLogs);
      socket.off("taskAssigned", fetchLogs);
    };
  }, []);

  return (
    <div className="activity-log">
      <h2>Activity Log</h2>
      <div className="log-entries">
        {logs.length === 0 ? (
          <p className="no-logs">No activity yet.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              <FaUser className="log-icon" />
              <div>
                <p className="log-text">{log.action}</p>
                <p className="log-time">
                  {new Date(log.createdAt).toLocaleString()} by{" "}
                  {log.user?.name || "User"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
