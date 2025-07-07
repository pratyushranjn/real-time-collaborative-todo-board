const ActionLog = require('../models/ActivityLog');


const logAction = async ({ action, user, task }) => {
  await ActionLog.create({
    action,
    user,
    task
  });
};


const getLogs = async (req, res) => {
  const logs = await ActionLog.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('user', 'name')
    .populate('task', 'title');

  res.json(logs);
};


module.exports = {
  logAction,
  getLogs
}