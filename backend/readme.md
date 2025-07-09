# 📦 Webalar Real-Time Collaborative Task Board – Backend

This is the backend API server for the **Real-Time Kanban Board** built as part of the Webalar Full Stack Internship assignment.

It powers features like authentication, task management, smart assignment, conflict detection, and real-time syncing.

---

## 🔗 GitHub Repo

👉 [GitHub – Full Project](https://github.com/pratyushranjn/real-time-collaborative-todo-board)

---

## 🛠 Tech Stack

- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- **JWT + HTTP-only Cookies** for Auth
- **Socket.IO** for real-time sync
- **dotenv**, **cookie-parser**, **cors**

---

# MongoDB connection string (replace with your actual URI)
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db-name

# Secret key for JWT token signing
JWT_SECRET=your_jwt_secret

# Set to "production" in deployed environment
NODE_ENV=development


## 🚀 Setup & Run Locally

### 1. Clone the Repo

```bash
git clone https://github.com/pratyushranjn/real-time-collaborative-todo-board.git

cd real-time-collaborative-todo-board/backend

