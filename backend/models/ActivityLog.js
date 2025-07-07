const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "Task Moved to Done"
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" }, // if multiple boards exist
}, {
  timestamps: true 
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
