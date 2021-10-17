const Task = require('../models/tasks');

const averageTimeCounter = async (req, res, next) => {
    const task = await Task.find({ $and: [{ problemSolverId: req.user._id.toString() }, { isSolved: true }] }).lean();
    const passedTime = await (task[0].solvedAt - task[0].acceptedAt);
    const averageTime = await ((passedTime + (req.user.averageSolutionTime / 60000)) / req.user.solvedProblemsNumber);
    req.user.averageSolutionTime = (averageTime / 60000);
    await req.user.save();
    await res.redirect('/');
};

module.exports = averageTimeCounter;