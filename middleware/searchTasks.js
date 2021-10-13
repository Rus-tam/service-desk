const Task = require('../models/tasks');
const User = require('../models/user');
const workerFinder = require('../utils/workerFinder');

const searchTasks = async (req, res, next) => {
    const tasks = await Task.find({ isSolved: false }).lean();
    const users = await User.find();

    let usersId = [];
    users.forEach(user => {
        usersId.push(user._id.toString());
    });
    let taskSolverId = [];
    tasks.forEach(task => {
       taskSolverId.push(task.problemSolverId);
    });
    const deletedUserId = taskSolverId.find(id => {
        return !usersId.includes(id);
    });
    const deletedUserTasks = tasks.filter(task => task.problemSolverId === deletedUserId);
    if (deletedUserTasks.length > 0) {
        const taskDestination = deletedUserTasks[0].destination;

        async function changeDeletedUserTasks() {
            for (const task of deletedUserTasks) {
                let worker = await workerFinder(taskDestination);
                task.problemSolverName = worker.surname + ' ' + worker.name + ' ' + worker.patronymic;
                task.problemSolverId = worker._id.toString();
                task.acceptedAt = 0;
            };
        };
        await changeDeletedUserTasks();

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

    next();
};

module.exports = searchTasks;
