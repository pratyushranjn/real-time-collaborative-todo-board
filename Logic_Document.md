# ✅ Smart Assign – Auto Assignment Logic

### 🎯 Objective:
To evenly distribute tasks among users by automatically assigning new or unassigned tasks to the user with the fewest currently active tasks.

---

## 🔧 How It Works

### 🔹 Trigger:
When the “✨ Smart Assign” button is clicked on a task card.

### 🛠️ Backend Execution:
- The system fetches all users from the database.
- It then counts how many tasks each user is currently assigned in "Todo" or "In Progress" status using a **MongoDB aggregation query**.
- This helps identify which user has the least workload.

### 📌 Assignment:
- The task is assigned to the user with the lowest count of active tasks.
- The task’s `assignedTo` and `lastModified` fields are updated.
- The updated task is saved back to the database.

### 🧾 Logging & Notification:
- A detailed activity log is created:  
  `"Smart assigned task to [User Name]"`
- A `taskAssigned` Socket.IO event is emitted to update all connected clients in real-time.
- On the frontend, a toast message is shown confirming the assignment.

### ✅ Benefits:
- Ensures fair distribution of workload.
- Eliminates manual decision-making.
- Real-time updates keep all users in sync.
- Seamlessly integrates with activity logs and live notifications.

---

# ⚔️ Conflict Handling – Real-Time Collaborative Safety

### 🎯 Objective:
Prevent data loss or overwrites when multiple users attempt to edit the same task simultaneously.

---

## 🔄 Scenario:
Two users open the same task:
- **User A** edits the title.
- **User B** changes the priority, but submits after User A.

❗ This can lead to data loss if not handled properly.

---

## 🔧 How It Works

### 🕒 Timestamp Tracking:
- Each task includes a `lastModified` timestamp.
- When a user submits an update, their client sends this timestamp along with the changes.

### 🖥️ Backend Comparison:
- The server compares the incoming timestamp with the current `lastModified` value in the database.
- If the server's version is newer (i.e., another user has updated it in the meantime), a **conflict is detected**.

### 🚨 Conflict Response:
- The server responds with:
  - HTTP `409 Conflict` status.
  - Both versions:
    - Client's version (submitted by the user)
    - Server's latest version (current in DB)

### 👥 User Resolution (Frontend):
- The user sees both versions side-by-side.
- They can choose to:
  - Merge changes manually
  - Overwrite the server version
- Upon confirmation, the task is saved with the user’s resolution.

### 📋 Logging & Update:
- The action is logged with a detailed message like:  
  `"Conflict resolved by [User] – title and priority updated"`
- Task is updated, and a real-time update is sent via Socket.IO.

---

## ⚙️ MongoDB Aggregation Pipeline – Smart Assign

Used to **find the user with the fewest active tasks** (`Todo` or `In Progress`).

### 🧪 Query Example

```js
Task.aggregate([
  { $match: { status: { $in: ["Todo", "In Progress"] }, assignedTo: { $ne: null } } },
  { $group: { _id: "$assignedTo", taskCount: { $sum: 1 } } },
  { $sort: { taskCount: 1 } },
  { $limit: 1 }
]);