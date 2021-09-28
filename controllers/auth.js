const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        docTitle: 'Страница авторизации'
    })
};

exports.postLogin = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        await res.cookie('access_token', 'Bearer ' + token, { httpOnly: true });
        await res.redirect('/');
    } catch (e) {
        res.status(400).send('Что-то пошло не так!');
    }
};

exports.getAuthorizationRequest = (req, res, next) => {
    res.render('auth/authorizationRequest', {
        docTitle: 'Пожалуйста, авторизуйтесь'
    });
};

exports.postLogout = async (req, res, next) => {
  try {
      req.user.tokens = [];
      await req.user.save();
      await res.redirect('/login');
  }  catch (e) {
      res.status(500).send('Что-то сломалось!');
  }
};