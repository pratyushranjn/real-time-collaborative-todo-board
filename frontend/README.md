# 🎨 Real-Time Collaborative CollabTask – Frontend

This is the **React frontend** for the Webalar Full Stack Development assignment. It provides a modern, animated, real-time **Kanban-style task management UI** integrated with live updates via **Socket.IO** and powered by a secure backend API.

---

## 🔗 GitHub Repository

👉 [GitHub – Full Project](https://github.com/pratyushranjn/real-time-collaborative-todo-board)

---

## 🛠 Tech Stack

- **React** (via Vite)
- **Context API** for global state
- **Axios** for API calls
- **Socket.IO Client** for real-time updates
- **Custom CSS** for styling
- **React Icons**, **React Hot Toast** for UI/UX

---

## 📦 Features

- 🔐 **Authentication**: Secure login and register using HTTP-only cookies
- 🧠 **Smart Assign**: AI-like logic to auto-assign tasks to the least busy user
- 🏷️ **Task Management**: Create, edit, delete, drag-drop between statuses
- 🚦 **Priority Badges**: Highlight urgency with colors (High/Medium/Low)
- 🔄 **Real-Time Sync**: All changes reflect instantly for all connected users
- 📝 **Conflict Detection**: Detect and prevent overwrites on stale task versions
- 📋 **Activity Log**: Shows latest 20 actions with user & timestamp
- 🎨 **Custom UI**: Smooth, responsive, and interactive layout

---


# 🌐 Backend API base URL
VITE_BACKEND_URL=https://real-time-collabtask.onrender.com/api

# 🔌 Socket.IO server URL
VITE_SOCKET_URL=https://real-time-collabtask.onrender.com


# Dashboard Layout
+------------------------------------------------------+
| Navbar                                     |
+------------------------------------------------------+
|  Kanban Board (flex: 1)     |  Activity Panel (290px)|
|                             |                        |
+------------------------------------------------------+
