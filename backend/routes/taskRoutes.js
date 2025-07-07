const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const { createTask } = require('../controllers/taskController');

router.post('/tasks', protect, createTask);
