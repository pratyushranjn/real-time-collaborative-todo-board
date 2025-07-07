const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper.js");

const {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController')

const auth = require('../middleware/authMiddleware');

router.use(auth); // protect all routes below

router.post('/createTask', asyncWrapper(createTask));

router.get('/', asyncWrapper(getAllTasks));

router.put('/:id', asyncWrapper(updateTask));

router.delete('/:id', asyncWrapper(deleteTask));

module.exports = router
