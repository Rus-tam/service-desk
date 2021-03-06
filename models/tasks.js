const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  problemMakerName: {
    type: String,
    required: true,
  },
  problemMakerRole: {
    type: String,
    required: true,
  },
  problemMakerLocation: {
    type: String,
    required: true,
  },
  problemMakerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: 0,
  },
  destination: {
    type: String,
  },
  problemSolverName: {
    type: String,
    default: "",
  },
  problemSolverId: {
    type: String,
    default: 0,
  },
  acceptedAt: {
    type: Number,
    default: 0,
  },
  solvedAt: {
    type: Number,
    default: 0,
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "В очереди",
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
