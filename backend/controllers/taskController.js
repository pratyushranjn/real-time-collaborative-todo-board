const Task = require("../models/Task")
const smartAssign = require('../utils/smartAssign');
const { logAction } = require('../controllers/logController');

// Smart Assign Controller
const smartAssignTask = async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const userId = await smartAssign(); // Core logic

    if (!userId) {
        res.status(400);
        throw new Error('No eligible users found');
    }

    task.assignedTo = userId;
    task.lastModified = new Date();
    await task.save();

    await logAction({
        action: "Smart assigned task",
        user: req.user.id,
        task: task._id
    });

    res.json(task);
};


// Create Task
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

        await logAction({
            action: "Created task",
            user: req.user.id,
            task: task._id
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

    const clientTimestamp = new Date(req.body.lastModified);
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Conflict detection logic
    if (clientTimestamp < task.lastModified) {
        return res.status(409).json({
            message: 'Conflict detected',
            serverVersion: task,
            clientVersion: req.body
        })
    }

    // If there's no conflict
    task.set({ ...req.body, lastModified: new Date() });
    const updatedTask = await task.save();

    await logAction({
        action: "Updated task",
        user: req.user.id,
        task: updatedTask._id
    });

    res.json(updatedTask)
}


const deleteTask = async (req, res) => {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
        res.status(404);
        throw new Error('Task not found');
    }

    await logAction({
        action: "Deleted task",
        user: req.user.id,
        task: deleted._id
    });

    res.json({ message: 'Task deleted successfully' });
}


module.exports = {
    createTask, getAllTasks, updateTask, deleteTask, smartAssignTask
}