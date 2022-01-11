const Task = require("../models/tasks");

//Каждый месяц 18 числа удаляет выполненные задачи из базы данных
const dbCorrector = async () => {
  const tasks = await Task.find({ isSolved: true }).lean();
  const date = new Date().getTime();
  const today = new Date(date).getDate();

  console.log(today);

  let oldTasks;

  if (today === 18) {
    oldTasks = tasks.filter((task) => {
      if (date - task.createdAt >= 1814000000) {
        return task;
      }
    });

    async function deleteTask(oldTasks) {
      for (const task of oldTasks) {
        await Task.deleteOne({ _id: task._id });
      }
    }

    await deleteTask(oldTasks);
  }
};

module.exports = dbCorrector;
