const User = require('../models/User');
const Task = require('../models/Task');

const smartAssign = async () => {
  const users = await User.find({}, '_id'); // Get all user IDs

  // Get task counts per user for Todo/In Progress
  const taskCounts = await Task.aggregate([
    { $match: { status: { $in: ['Todo', 'In Progress'] }, assignedTo: { $ne: null } } },
    { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
  ]);

  // Map userId to task count
  const countsMap = new Map();
  taskCounts.forEach(({ _id, count }) => {
    countsMap.set(_id.toString(), count);
  });

  // Find the user with the least count
  let minUserId = null;
  let minCount = Infinity;

  for (const user of users) {
    const count = countsMap.get(user._id.toString()) || 0;
    if (count < minCount) {
      minCount = count;
      minUserId = user._id;
    }
  }

  return minUserId || null;
};

module.exports = smartAssign;


