const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        docTitle: 'Страница авторизации',
        loginCSS: true
    })
};

exports.postLogin = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        await res.cookie('access_token', 'Bearer ' + token, { httpOnly: true });
        await res.redirect('/');
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    }
};

exports.getAuthorizationRequest = (req, res) => {
    res.render('auth/authorizationRequest', {
        docTitle: 'Пожалуйста, авторизуйтесь'
    });
};

exports.postLogout = async (req, res) => {
  try {
      req.user.tokens = [];
      await req.user.save();
      await res.redirect('/login');
  }  catch (e) {
      res.render('error', {
          docTitle: 'Ошибка',
          message: 'Что-то пошло не так!',
          error: e
      });
  }
};