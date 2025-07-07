const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(value) {
        const forbidden = ['todo', 'in progress', 'done'];
        return !forbidden.includes(value.toLowerCase());
      },
      message: 'Task title cannot match column names: Todo, In Progress, or Done'
    }
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Done'],
    default: 'Todo'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// title unique per board
taskSchema.index({ boardId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Task', taskSchema);
