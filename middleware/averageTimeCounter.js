const Task = require('../models/tasks');

const averageTimeCounter = async (req, res, next) => {
    let averageTime = 0;
    const task = await Task.find({ $and: [{ problemSolverId: req.user._id.toString() }, { isSolved: true }] }).lean();
    const passedTime = await (task[task.length - 1].solvedAt - task[task.length - 1].acceptedAt);
    if (req.user.solvedProblemsNumber === 0) {
        averageTime = await ((passedTime + (req.user.averageSolutionTime / 60000)) / 1);
    } else {
        averageTime = await ((passedTime + (req.user.averageSolutionTime / 60000)) / req.user.solvedProblemsNumber);
    }
    req.user.averageSolutionTime = (averageTime / 60000).toFixed(2);
    await req.user.save();
    await res.redirect('/');
};

module.exports = averageTimeCounter;