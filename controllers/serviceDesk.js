const User = require('../models/user');
const Task = require('../models/tasks');
const workerFinder = require('../utils/workerFinder');

exports.getIndexPage = async (req, res, next) => {
    try {
        const tasks = await Task.find({ problemMakerId: req.user._id }).lean();
        tasks.forEach((task) => {
           if (task.acceptedAt < new Date(2020)) {
               task.acceptedAt = '-';
           }
           if (task.acceptedAt === '-') {
               task.status = 'В очереди';
           } else if (task.acceptedAt > new Date(2020) && !task.isSolved) {
               task.status = 'В процессе решения';
           } else {
               task.status = 'Задача завершена';
           }
        });

        res.render('serviceDesk/index', {
            docTitle: 'Регистрация заявок',
            isAdmin: req.isAdmin,
            user: req.user,
            tasks: tasks,
            activeRequest: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
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
            error: e
        });
    };
};

exports.getServiceCatalog = (req, res) => {
    res.render('serviceDesk/serviceCatalog', {
        docTitle: 'Каталог',
        isAdmin: req.isAdmin
    });
};

exports.getProblemDescriptionSoftware = (req, res) => {
    res.render('serviceDesk/problemDescription', {
        docTitle: 'Заполнение формы',
        isAdmin: req.isAdmin,
        destination: ['OfficeGod']
    });
};

exports.getProblemDescriptionOfficeEquipment = (req, res) => {
  res.render('serviceDesk/problemDescription', {
      docTitle: 'Заполнение формы',
      isAdmin: req.isAdmin,
      destination: ['AnyKey']
  });
};

exports.getProblemDescriptionFurniture = (req, res) => {
  res.render('serviceDesk/problemDescription', {
     docTitle: 'Заполнение формы',
     isAdmin: req.isAdmin,
     destination: ['HandyMan']
  });
};

exports.getProblemDescriptionAdmin = (req, res) => {
    res.render('serviceDesk/problemDescription', {
        docTitle: 'Заполнение формы',
        isAdmin: req.isAdmin,
        destination: ['Admin']
    });
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
         createdAt: new Date,
         destination: req.body.destination,
          problemSolverName: '',
          problemSolverId: '',
          solvedAt: null
      });

      const worker = await workerFinder(task.destination.toString());
      task.problemSolverName = await (worker.surname + ' ' + worker.name + ' ' + worker.patronymic);
      task.problemSolverId = worker._id.toString();

      await task.save();

      await res.redirect('/');
  }  catch (e) {
      res.render('error', {
          docTitle: 'Ошибка',
          message: 'Что-то пошло не так!',
          error: e
      });
  }
};

exports.getTaskDetails = async (req, res) => {
    try {
        const taskId = req.params.taskId.replace(':', '');
        const task = await Task.findOne({ _id: taskId });

        res.render('serviceDesk/taskDetails', {
            docTitle: 'Детали задачи',
            isAdmin: req.isAdmin,
            task: task.toJSON(),
            user: req.user,
            isBusy: req.user.isBusy
        })
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    }
};

exports.postSetAcceptedTime = async (req, res) => {
    try {
        const taskId = req.params.taskId.replace(':', '');
        const task = await Task.findOne({ _id: taskId });
        task.acceptedAt = new Date;
        await task.save();

        req.user.isBusy = true;
        await req.user.save();

        await res.redirect('/profile');
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    };
};

exports.postSetSolvedTime = async (req, res) => {
    try {
        const taskId = req.params.taskId.replace(':', '');
        const task = await Task.findOne({ _id: taskId });
        task.solvedAt = new Date;
        task.isSolved = true;
        await task.save();
        req.user.isBusy = false;
        req.user.solvedProblemsNumber++;
        await req.user.save();

        await res.redirect('/profile');
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    }
};
