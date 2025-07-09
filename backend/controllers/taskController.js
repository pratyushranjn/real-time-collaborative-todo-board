const Task = require("../models/Task");
const smartAssign = require("../utils/smartAssign");
const { logAction } = require("../controllers/logController");

// Smart Assign Controller
const smartAssignTask = async (req, res) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const userId = await smartAssign(); // Core smart assign logic
  if (!userId) {
    res.status(400);
    throw new Error("No eligible users found");
  }

  task.assignedTo = userId;
  task.lastModified = new Date();
  await task.save();

  // Populate assignedTo with name and email for frontend
  const populatedTask = await Task.findById(task._id).populate(
    "assignedTo",
    "name email"
  );

  // Save the log
  await logAction({
    action: `Smart assigned task to ${populatedTask.assignedTo.name}`,
    user: req.user.id,
    taskId: task._id,
  });

  if (req.app.io) {
    req.app.io.emit("taskAssigned")
  }

  res.json(populatedTask);
};

// Create Task
const createTask = async (req, res) => {
  const { title, description, priority, assignedTo } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
    });

    await logAction({
      action: "Created task",
      user: req.user.id,
      taskId: task._id,
    });

    // Emit to all clients
    if (req.app.io) {
      req.app.io.emit("taskCreated", task);
    }

    res.status(201).json(task);
  } catch (err) {
    // Error handling...
    if (err.code === 11000) {
      res.status(400);
      throw new Error("Task title must be unique");
    }
    if (err.errors?.title?.message) {
      res.status(400);
      throw new Error(err.errors.title.message);
    }

    throw err;
  }
};

const getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
};


const updateTask = async (req, res) => {
  const clientTimestamp = new Date(req.body.lastModified);
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Conflict detection logic
  if (clientTimestamp < task.lastModified) {
    return res.status(409).json({
      message: "Conflict detected",
      serverVersion: task,
      clientVersion: req.body,
    });
  }

  // Prevent log/save if nothing changed
  const isSame =
    req.body.title === task.title &&
    req.body.description === task.description &&
    req.body.priority === task.priority &&
    req.body.assignedTo === task.assignedTo?.toString() &&
    req.body.status === task.status;

  if (isSame) {
    return res.status(200).json(task); // No change → no save/log/socket
  }

  // Track meaningful changes
  const changes = [];
  if (req.body.title && req.body.title !== task.title) {
    changes.push(`title: "${task.title}" → "${req.body.title}"`);
  }
  if (req.body.description && req.body.description !== task.description) {
    changes.push(`description updated`);
  }
  if (req.body.priority && req.body.priority !== task.priority) {
    changes.push(`priority: ${task.priority} → ${req.body.priority}`);
  }
  if (
    req.body.assignedTo &&
    req.body.assignedTo !== task.assignedTo?.toString()
  ) {
    changes.push(`assignee changed`);
  }
  if (req.body.status && req.body.status !== task.status) {
    changes.push(`status: ${task.status} → ${req.body.status}`);
  }

  const action =
    changes.length > 0
      ? `Edited task (${changes.join(", ")})`
      : "Edited task";

  // Apply updates and save
  task.set({ ...req.body, lastModified: new Date() });
  const updatedTask = await task.save();

  await logAction({
    action,
    user: req.user.id,
    taskId: updatedTask._id,
  });

  if (req.app.io) {
    req.app.io.emit("taskUpdated", updatedTask);
  }

  res.json(updatedTask);
};


const deleteTask = async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error("Task not found");
  }

  await logAction({
    action: "Deleted task",
    user: req.user.id,
    taskId: deleted._id,
  });

  // Emit to all connected clients
  if (req.app.io) {
    req.app.io.emit("taskDeleted", { id: deleted._id });
  }

  res.json({ message: "Task deleted successfully" });
};


module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  smartAssignTask,
};
