# 🚀 Real-Time Collaborative To-Do Board  
**Build. Assign. Collaborate. Instantly.**

An intuitive, **Kanban-style task management** board with real-time collaboration, intelligent task assignment, and conflict resolution — built for the **Webalar Full Stack Internship Assignment**.

🌐 Live Demo: [CollabTask](https://real-time-collaborative-todo-board.vercel.app/dashboard)   
📦 GitHub Repo: [real-time-collaborative-todo-board](https://github.com/pratyushranjn/real-time-collaborative-todo-board)

---

## 🧩 Project Overview

CollabTask is a real-time collaborative Kanban board, inspired by Trello, where multiple users can manage and track tasks together. It includes drag-and-drop columns (Todo, In Progress, Done), smart task assignment, conflict resolution, and a live activity log — all built using the MERN stack and Socket.IO.  
It includes:

- 🔐 **Secure login** via JWT + HTTP-only cookies  
- 🔄 **Live task sync** via Socket.IO (WebSockets)  
- ✨ **Smart Assign** to auto-distribute tasks based on workload
- ⚠️ **Conflict Detection** for handling concurrent edits (via lastModified)  
- 📃 Real-time **Activity Log** (last 20 actions)  
- 🟦 Trello-style Drag-and-Drop between Todo, In Progress, and Done columns
- 📝 Live activity log for task creation, updates, and deletes
- 🧼 Clean, UI with zero UI frameworks 

---

## 📌 Core Features

- ✅ JWT-based user auth with cookies  
- ✅ Drag-and-drop Kanban board (`Todo`, `In Progress`, `Done`)  
- ✅ Real-time sync across users using Socket.IO  
- ✅ Smart Assign: AI-like logic to find least busy user  
- ✅ Conflict resolution: prevents overwriting newer task versions  
- ✅ Activity Log Panel: shows latest 20 actions with user info  
- ✅ Edit/Delete functionality with modal popups  
- ✅ Responsive layout (mobile-friendly)  
- ✅ No UI libraries — built entirely with **custom React + CSS**

---

## 🧰 Tech Stack

### 💻 Frontend
- React + Vite
- React Router DOM
- Context API
- Axios
- Socket.IO Client
- Vanilla CSS (no frameworks)

### 🖥 Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + HTTP-only Cookies
- Bcrypt.js
- Socket.IO
- Dotenv + CORS

---

## 🖼️ UI Layout

🔳 **Three Kanban Columns**:
- **Todo**
- **In Progress**
- **Done**

🧾 Each task card includes:
- Task title & description
- Priority badge (`High`, `Medium`, `Low`)
- Assignee initials (if assigned)
- Options menu: `Edit`, `Delete`
- ✨ Smart Assign icon (magic wand)

📋 **Right-side panel**:
- Real-time Activity Log  
- Shows actions like `Created`, `Updated`, `Assigned`, `Deleted`  
- Includes username + timestamp

---



## 📷 Screenshots

### 🧼 Dashboard — Clean View
The dashboard displays a clean and minimal view in Kanban columns.

![Dashboard](./frontend/public/dashboard.png)

---

### ✍️ Create Task — with Priority 
Users can easily create new tasks using a modal form. Newly created tasks appear instantly for all users and include:
- Priority badge (`High`, `Medium`, `Low`)
- Smart-assigned user initials
- Edit and delete options

![Created Task](./frontend/public/createTask.png)

---

### 🔄 Priority-Based Task Movement
Tasks can be **dragged and dropped** across the three Kanban columns:
- Todo → In Progress → Done  
With real-time synchronization and persistent priority indicators.

![Priority Based Task View](./frontend/public/prority_based.png)


#### 📁 Environment Variables

```env
# Backend
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Frontend (Vite)
VITE_BACKEND_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com


## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/pratyushranjn/real-time-collaborative-todo-board.git

cd real-time-collaborative-todo-board

