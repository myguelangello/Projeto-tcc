const mongoose = require('../../database');

/* Schema são mais ou menos os campos que vão ter dentro do bd */
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//definindo o model
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
