# 📝 Real-Time Collaborative To-Do Board

A full-stack Kanban-style to-do board that supports **real-time collaboration** between users. Built for the Webalar Full Stack Internship Assignment using the MERN stack and WebSockets.

---

## 📌 Features

- ✅ JWT-based User Authentication (Register/Login)
- ✅ Drag & Drop Kanban Board (Todo, In Progress, Done)
- ✅ Real-time Sync using Socket.IO
- ✅ Smart Assign: Auto-assign to least busy user
- ✅ Conflict Detection & Resolution
- ✅ Activity Log Panel (last 20 actions)
- ✅ Mobile Responsive Design
- ✅ No UI libraries used — Pure React + CSS

---

## 🧰 Tech Stack Used

### 💻 Frontend
- React
- React Router
- Socket.IO Client
- Axios
- Vanilla CSS 

### 🖥 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + Bcrypt
- Socket.IO
- CORS + Dotenv

---

## UI Design

The interface is custom-built using React and CSS (no UI libraries).  
It follows a Kanban layout with:

- Three status columns: Todo, In Progress, Done
- Cards with drag & drop
- Priority indicators and user initials
- Right-side real-time Activity Log


## 🏗 Setup Instructions

### 📦 Backend

```bash
cd backend
npm install
