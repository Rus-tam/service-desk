const Task = require('../models/tasks');
const workerFinder = require('../utils/workerFinder');

//Поиск работника для выполнения задачи, если аккаунт предыдущего работника был удален
const findProblemSolver = async (userId) => {
    let worker;
    const deletedUserTasks = await Task.find({ problemSolverId: userId }).lean();

    async function changeTasksInfo() {
        for (const task of deletedUserTasks) {
            worker = await workerFinder(task.destination);
            task.problemSolverName = worker.surname + ' ' + worker.name + ' ' + worker.patronymic;
            task.problemSolverId = worker._id.toString();
            task.acceptedAt = 0;
        };
    };
    await changeTasksInfo();

    async function changeTasks() {
        for (const modifiedTask of deletedUserTasks) {
            const task = await Task.findOne({ _id: modifiedTask._id });

            task.description = modifiedTask.description;
            task.priority = modifiedTask.priority;
            task.problemMakerName = modifiedTask.problemMakerName;
            task.problemMakerRole = modifiedTask.problemMakerRole;
            task.problemMakerLocation = modifiedTask.problemMakerLocation;
            task.problemMakerId = modifiedTask.problemMakerId;
            task.createdAt = modifiedTask.createdAt;
            task.destination = modifiedTask.destination;
            task.problemSolverName = modifiedTask.problemSolverName;
            task.problemSolverId = modifiedTask.problemSolverId;
            task.acceptedAt = modifiedTask.acceptedAt;

            await task.save();
        };
    };

    await changeTasks();
};

module.exports = findProblemSolver;