const Task = require("../models/Task")

const createTask = async (req, res) => {
  const { title, description, priority, assignedTo, boardId } = req.body;

  if (!boardId) {
    res.status(400);
    throw new Error('boardId is required');
  }

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      boardId
    });

    res.status(201).json(task);

  } catch (err) {
    // Handle duplicate key error from MongoDB
    if (err.code === 11000) {
      res.status(400);
      throw new Error('Task title must be unique within this board');
    }

    // Handle Mongoose validation error for title matching column names
    if (err.errors?.title?.message) {
      res.status(400);
      throw new Error(err.errors.title.message);
    }

    // Other unexpected errors
    throw err;
  }
};


const getAllTasks = async (req, res) => {
    const tasks = await Task.find()
        .populate('assignedTo', 'name email')
    res.json(tasks);
}

const updateTask = async (req, res) => {
    const updatedData = {
        ...req.body,
        lastModified: new Date()
    };

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updatedData, {
        new: true
    })

    if (!updatedTask) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.json(updateTask)
}

const deleteTask = async (req, res) => {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.json({ message: 'Task deleted successfully' });
}

module.exports = {
    createTask, getAllTasks, updateTask, deleteTask
}