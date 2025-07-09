## 🧠 Smart Assign Logic

When a user clicks the ✨ Smart Assign icon:

1. Backend uses a **MongoDB aggregation** to count how many tasks each user is currently assigned (with status not "Done").
2. It finds the user with the **least task count**.
3. That user is assigned to the task.
4. The assignment is **broadcast live** using Socket.IO to all connected clients.
5. A log is recorded with `Smart assigned task to [username]`.

> 🧪 Example:
If User A has 2 tasks and User B has 0, the new task is assigned to User B.

---

## 🛡 Conflict Handling

Each task carries a `lastModified` timestamp.

- When a user attempts to update a task:
  - The backend compares the submitted timestamp with the server version.
  - If the **client timestamp is older**, a `409 Conflict` is returned.
  - The frontend displays a conflict warning and shows the server version.

> 📌 Example:  
Two users edit Task X.  
User A clicks "Save" → success.  
User B clicks "Save" → receives conflict notice because Task X was already modified.

---