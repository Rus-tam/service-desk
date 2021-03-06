const Task = require("../models/tasks");

//Производит расчет среднего времени выполнения задачи
const averageTimeCounter = async (req, res) => {
  let averageTime;
  const task = await Task.find({
    $and: [{ problemSolverId: req.user._id.toString() }, { isSolved: true }],
  }).lean();
  const passedTime = await (task[task.length - 1].solvedAt -
    task[task.length - 1].acceptedAt);
  if (req.user.solvedProblemsNumber === 0) {
    averageTime = await ((passedTime + req.user.averageSolutionTime / 60000) /
      1);
  } else {
    averageTime = await ((passedTime + req.user.averageSolutionTime / 60000) /
      req.user.solvedProblemsNumber);
  }
  req.user.averageSolutionTime = (averageTime / 60000).toFixed(2);
  await req.user.save();
  await res.redirect("/");
};

module.exports = averageTimeCounter;
