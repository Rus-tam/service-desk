const User = require('../models/user');
const Task = require('../models/tasks');

// const workerFinder = async (destination) => {
//     const workers = await User.find({position: destination});
//     const workerIndex = Math.floor((Math.random() * (workers.length + 1)));
//     const worker = workers[workerIndex];
//     return worker;
// };

const workerFinder = async (destination) => {
    const workers = await User.find({ position: destination });
    const freeWorkers = await workers.filter( worker => !worker.isBusy);

    if (freeWorkers.length > 0) {
        let minSolvedProblemsNumber = workers[0].solvedProblemsNumber;
        freeWorkers.forEach((worker) => {
            worker.solvedProblemsNumber <= minSolvedProblemsNumber ? minSolvedProblemsNumber = worker.solvedProblemsNumber : null;
        });
        const worker = freeWorkers.filter(worker => worker.solvedProblemsNumber === minSolvedProblemsNumber);
        return worker[0];
    } else {
        const workerIndex = Math.floor((Math.random() * (workers.length + 1 )));
        const worker = workers[workerIndex];
        return worker[0]
    }
};

module.exports = workerFinder;