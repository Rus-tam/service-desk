const User = require('../models/user');
const Task = require('../models/tasks');
const workerFinder = require('../utils/workerFinder');

exports.getIndexPage = (req, res, next) => {
    res.render('serviceDesk/index', {
        docTitle: 'Регистрация заявок',
        isAdmin: req.isAdmin
    });
};

exports.getAboutPage = (req, res, next) => {
    res.render('serviceDesk/about', {
        docTitle: 'Инфо',
        isAdmin: req.isAdmin,
        user: req.user
    });
};

exports.getProfile = async (req, res) => {
    await res.render('serviceDesk/profile', {
        docTitle: 'Профиль пользователя',
        isAdmin: req.isAdmin,
        user: req.user.toJSON()
    });
};

exports.getServiceCatalog = (req, res) => {
    res.render('serviceDesk/serviceCatalog', {
        docTitle: 'Каталог',
        isAdmin: req.isAdmin
    });
};

exports.getProblemDescriptionSoftware = async (req, res) => {
    await workerFinder('Программист')
    res.render('serviceDesk/problemDescription', {
        docTitle: 'Заполнение формы',
        isAdmin: req.isAdmin,
        destination: ['Программист']
    });
};

exports.postProblemDescriptionSoftware = async (req, res) => {
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

      //await task.save();

      const worker = await workerFinder(task.destination.toString());
      task.problemSolverName = await (worker.surname + ' ' + worker.name + ' ' + worker.patronymic);
      task.problemSolverId = worker._id.toString();

      await task.save();

      await res.redirect('/');
  }  catch (e) {
      res.send('Что-то сломалось');
      console.log(e)
  }
};
