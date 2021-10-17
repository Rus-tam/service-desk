const User = require('../models/user');
const Task = require('../models/tasks');
const workerFinder = require('../utils/workerFinder');
const timeWorker = require('../utils/timeWorker');
const mailSender = require('../utils/mailSender');

exports.getIndexPage = async (req, res, next) => {
    try {
        let isTaskPresent;
        let tasks = await Task.find({ problemMakerId: req.user._id }).lean();
        tasks.length === 0 ? isTaskPresent = false : isTaskPresent = true;

        tasks.forEach((task) => {
            if (task.status === 'Задача решена') {
                const pastedTime = new Date().getTime() - new Date(task.solvedAt);
                pastedTime > 172800000 ? task.status = 'Задача завершена более 2 суток тому назад' : null;
            }

           if (task.acceptedAt < new Date(2020)) {
               task.acceptedAt = '-';
           }

           const normalTimeFormatCreatedTime = timeWorker(task.createdAt);
           task.createdAt = normalTimeFormatCreatedTime;

           const normalTimeFormatAcceptedTime = timeWorker(task.acceptedAt);
           task.acceptedAt = normalTimeFormatAcceptedTime;
        });

        tasks = tasks.filter(task => {
            return task.status != 'Задача завершена более 2 суток тому назад'
        });

        res.render('serviceDesk/index', {
            docTitle: 'Регистрация заявок',
            isAdmin: req.isAdmin,
            user: req.user,
            tasks: tasks,
            activeRequest: true,
            isTaskPresent
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};

exports.getAboutPage = (req, res) => {
    res.render('serviceDesk/about', {
        docTitle: 'Инфо',
        isAdmin: req.isAdmin,
        user: req.user,
        activeAbout: true
    });
};

exports.getProfile = async (req, res) => {
    try {
        const tasks = await Task.find({ $and: [{ problemSolverId: req.user._id.toString() }, { isSolved: false }]}).lean();
        tasks.forEach(task => {
           const normalTimeFormatCreatedAt = timeWorker(task.createdAt);
           task.createdAt = normalTimeFormatCreatedAt;
        });
        await res.render('serviceDesk/profile', {
            docTitle: 'Профиль пользователя',
            isAdmin: req.isAdmin,
            user: req.user.toJSON(),
            tasks: tasks,
            activeProfile: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    };
};

exports.getServiceCatalog = (req, res) => {
    try {
        res.render('serviceDesk/serviceCatalog', {
            docTitle: 'Каталог',
            isAdmin: req.isAdmin,
            user: req.user,
            activeCatalog: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};

exports.getProblemDescriptionSoftware = (req, res) => {
    try {
        res.render('serviceDesk/problemDescription', {
            docTitle: 'Заполнение формы',
            isAdmin: req.isAdmin,
            user: req.user,
            destination: ['OfficeGod'],
            problemDescription: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};

exports.getProblemDescriptionOfficeEquipment = (req, res) => {
    try {
        res.render('serviceDesk/problemDescription', {
            docTitle: 'Заполнение формы',
            isAdmin: req.isAdmin,
            user: req.user,
            destination: ['AnyKey'],
            problemDescription: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};

exports.getProblemDescriptionFurniture = (req, res) => {
    try {
        res.render('serviceDesk/problemDescription', {
            docTitle: 'Заполнение формы',
            isAdmin: req.isAdmin,
            user: req.user,
            destination: ['HandyMan'],
            problemDescription: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};

exports.getProblemDescriptionAdmin = (req, res) => {
    try {
        res.render('serviceDesk/problemDescription', {
            docTitle: 'Заполнение формы',
            isAdmin: req.isAdmin,
            user: req.user,
            destination: ['Admin'],
            problemDescription: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};

exports.postProblemDescription = async (req, res) => {
  try {
      const task = new Task({
         description: req.body.description,
         priority: req.body.priority,
         problemMakerName: req.user.surname + ' ' + req.user.name + ' ' + ' ' + req.user.patronymic,
         problemMakerRole: req.user.role,
         problemMakerLocation: req.user.location,
         problemMakerId: req.user._id.toString(),
         createdAt: new Date().getTime(),
         destination: req.body.destination,
         problemSolverName: '',
         problemSolverId: '',
         solvedAt: null
      });

      const worker = await workerFinder(task.destination.toString());
      task.problemSolverName = await (worker.surname + ' ' + worker.name + ' ' + worker.patronymic);
      task.problemSolverId = worker._id.toString();

      await task.save();

      await mailSender(worker);

      await res.redirect('/');
  }  catch (e) {
      res.render('error', {
          docTitle: 'Ошибка',
          message: 'Что-то пошло не так!',
          error: e,
          user: req.user,
          isAdmin: req.isAdmin
      });
  }
};

exports.getTaskDetails = async (req, res) => {
    try {
        let isBlocked;
        let counter = 0;
        let isTwoProcessedTasks;
        const taskId = req.params.taskId.replace(':', '');
        const task = await Task.findOne({ _id: taskId }).lean();

        if (task.status === 'В очереди') {
            isBlocked = false;
        } else if (task.status === 'В процессе решения') {
            isBlocked = true
        }

        const normalTimeFormatCreatedAt = timeWorker(task.createdAt);
        task.createdAt = normalTimeFormatCreatedAt;
        if (task.acceptedAt == 0) {
            task.acceptedAt = '-';
        } else {
            const normalTimeFormatAcceptedAt = timeWorker(task.acceptedAt);
            task.acceptedAt = normalTimeFormatAcceptedAt;
        }
        
        const tasks = await Task.find({ $and: [{ problemSolverId: req.user._id.toString() }, { isSolved: false }]}).lean();
        tasks.forEach(task => {
           task.status === 'В процессе решения' ? counter++ : null;
        });
        counter >= 1 ? isTwoProcessedTasks = true : isTwoProcessedTasks = false;

        res.render('serviceDesk/taskDetails', {
            docTitle: 'Детали задачи',
            isAdmin: req.isAdmin,
            task: task,
            user: req.user,
            activeTaskDetails: true,
            isBlocked,
            isTwoProcessedTasks
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};

exports.postSetAcceptedTime = async (req, res) => {
    try {
        const taskId = req.params.taskId.replace(':', '');
        const task = await Task.findOne({ _id: taskId });
        task.acceptedAt = new Date().getTime();
        task.status = 'В процессе решения';
        await task.save();

        req.user.isBusy = true;
        await req.user.save();

        await res.redirect('/profile');
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    };
};

exports.postSetSolvedTime = async (req, res, next) => {
    try {
        const taskId = req.params.taskId.replace(':', '');
        const task = await Task.findOne({ _id: taskId });
        task.solvedAt = new Date().getTime();
        task.isSolved = true;
        task.status = 'Задача решена';

        await task.save();

        req.user.isBusy = false;
        req.user.solvedProblemsNumber++;

        await req.user.save();

        await next();

    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e,
            user: req.user,
            isAdmin: req.isAdmin
        });
    }
};
