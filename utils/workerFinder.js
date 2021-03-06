const User = require("../models/user");

//Поиск работника для выполнения новой задачи
const workerFinder = async (destination) => {
  const workers = await User.find({ role: destination });
  const freeWorkers = workers.filter((worker) => worker.isBusy === false);

  if (freeWorkers.length > 0) {
    let minSolvedProblemsNumber = freeWorkers[0].solvedProblemsNumber;
    freeWorkers.forEach((worker) => {
      worker.solvedProblemsNumber <= minSolvedProblemsNumber
        ? (minSolvedProblemsNumber = worker.solvedProblemsNumber)
        : null;
    });
    const worker = freeWorkers.filter(
      (worker) => worker.solvedProblemsNumber === minSolvedProblemsNumber
    );
    return worker[0];
  } else {
    const workerIndex = Math.floor(Math.random() * (workers.length + 1));
    const worker = workers[workerIndex];
    return worker;
  }
};

module.exports = workerFinder;
