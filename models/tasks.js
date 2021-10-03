const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    problemMakerName: {
        type: String,
        required: true
    },
    problemMakerRole: {
        type: String,
        required: true
    },
    problemMakerLocation: {
        type: String,
        required: true
    },
    problemMakerId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    destination: {
      type: String,
    },
    problemSolverName: {
        type: String,
        default: ''
    },
    problemSolverId: {
        type: String,
        default: 0
    },
    acceptedAt: {
      type: Date,
      default: 0
    },
    solvedAt: {
        type: Date,
        default: null
    },
    isSolved: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;