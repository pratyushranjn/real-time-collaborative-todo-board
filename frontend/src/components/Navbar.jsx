import { useState } from "react";
import { Link } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { MdOutlineHistory } from "react-icons/md";
import NewTaskModal from "./NewTask";
import { useAuth } from "../context/AuthContext";
import { useBoard } from "../context/BoardContext";
import ActivityLog from "../components/ActionLog";

import "../styles/Navbar.css";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showActionLog, setShowActionLog] = useState(false);

  const { user, logout } = useAuth();
  const { setPriorityFilter } = useBoard();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  const handleFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <CgNotes size={24} color="#fff" />
          <Link to="/" className="logo">CollabTask</Link>
          {user?.name && (
            <div className="user-greeting">
              Hello, <span>{user.name}</span>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {/* Desktop View */}
          <div className="desktop-only right-group">
            <div className="custom-select-wrapper">
              <select className="priority-select" onChange={handleFilterChange}>
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <span className="custom-arrow">&#9662;</span>
            </div>

            <button className="new-task-button" onClick={() => setShowModal(true)}>
              <span className="icon-text">
                <IoAddCircleOutline size={20} />
                <span>Create Task</span>
              </span>
            </button>

            <button className="logout-button" onClick={handleLogout}>
              <AiOutlineLogout size={18} style={{ marginRight: "6px" }} />
              Logout
            </button>
          </div>

          {/* Mobile View */}
          <div className="mobile-only right-group">
            <button className="new-task-button" onClick={() => setShowModal(true)}>
              <IoAddCircleOutline size={20} />
            </button>
            <button className="hamburger" onClick={() => setShowMenu(!showMenu)}>
              <FiMenu />
            </button>

               <button onClick={() => setShowActionLog(true)} className="log-toggle">
             <MdOutlineHistory size={26} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMenu && (
          <div className="mobile-menu show">
            <div className="custom-select-wrapper">
              <select className="priority-select" onChange={handleFilterChange}>
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <span className="custom-arrow">&#9662;</span>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              <AiOutlineLogout size={18} style={{ marginRight: "6px" }} />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Action Log Panel for Mobile */}
      {showActionLog && (
        <div className="mobile-action-log-panel">
          <div className="log-header">
            <h3>Activity Log</h3>
            <button onClick={() => setShowActionLog(false)} className="close-log">✕</button>
          </div>
          <div className="log-body">
            <ActivityLog />
          </div>
        </div>
      )}

      <NewTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Navbar;
