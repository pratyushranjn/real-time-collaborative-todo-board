const { Server } = require("socket.io");

// Map to track task editors → { taskId: { userId, socketId } }
const editingTasks = new Map();

module.exports = function setupSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  app.io = io;

  io.on("connection", (socket) => {
    console.log("Socket Connected", socket.id);

    socket.on("taskUpdated", (data) => {
      socket.broadcast.emit("taskUpdated", data);
    });

    socket.on("taskAssigned", (data) => {
      socket.broadcast.emit("taskAssigned", data);
    });

    socket.on("taskMoved", (data) => {
      socket.broadcast.emit("taskMoved", data);
    });

    socket.on("logCreated", (data) => {
      socket.broadcast.emit("logCreated", data);
    });


    // Conflict Detection: when a user starts editing a task
    socket.on("editingTask", ({ taskId, userId }) => {
      const currentEditor = editingTasks.get(taskId);

      if (currentEditor && currentEditor.userId !== userId) {

        // Notify both users about the conflict
        io.to(socket.id).emit("conflictDetected", { taskId });
        io.to(currentEditor.socketId).emit("conflictDetected", { taskId });
      } else {
        editingTasks.set(taskId, { userId, socketId: socket.id });
      }
    });

    // Removes task from map
    socket.on("stopEditingTask", ({ taskId }) => {
      editingTasks.delete(taskId);
    });

    // cleanup on disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (const [taskId, editor] of editingTasks.entries()) {
        if (editor.socketId === socket.id) {
          editingTasks.delete(taskId);
        }
      }
    });
  });
};
