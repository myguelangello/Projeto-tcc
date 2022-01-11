const mongoose = require('../../database');

/* Schema são mais ou menos os campos que vão ter dentro do bd */
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//definindo o model
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
