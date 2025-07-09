import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ActivityLog from "../components/ActionLog";
import KanbanBoard from "../components/KanbanBoard";
import "../App.css";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileLog, setShowMobileLog] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* Pass the toggle function to Navbar */}
      <Navbar setShowMobileLog={setShowMobileLog} />

      <div className="dashboard-content">
        <KanbanBoard />

        {/* Show desktop log if not mobile */}
        {!isMobile && (
          <div className="activity-panel">
            <ActivityLog />
          </div>
        )}
      </div>

      {/* Slide-in action log on mobile */}
      {isMobile && showMobileLog && (
        <div className="mobile-action-log-panel">
          <div className="log-header">
            <h3>Activity Log</h3>
            <button className="close-log" onClick={() => setShowMobileLog(false)}>
              &times;
            </button>
          </div>
          <div className="log-body">
            <ActivityLog />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
