const ActionLog = require('../models/ActivityLog');


const logAction = async ({ action, user, taskId }) => {
  await ActionLog.create({
    action,
    user,
    taskId
  });
};

const getLogs = async (req, res) => {
  const logs = await ActionLog.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('user', 'name')
    .populate('taskId', 'title');

  res.json(logs);
};



module.exports = {
  logAction,
  getLogs
}