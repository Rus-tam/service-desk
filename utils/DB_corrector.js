const Task = require('../models/tasks');

const dbCorrector = async () => {
    const tasks = await Task.find().lean();
    const date = new Date().getTime();
    const today = new Date(date).getDate();

    let oldTasks;

    if (today === 17) {
        oldTasks = tasks.filter(task => {
            if ((date - task.createdAt) >= 1814000000) {
                return task;
            };
        });

        async function deleteTask(oldTasks) {
            for (const task of oldTasks) {
                await Task.deleteOne({ _id: task._id });
            }
        };

        await deleteTask(oldTasks);
    };
};

module.exports = dbCorrector;