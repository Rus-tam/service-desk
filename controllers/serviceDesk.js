const User = require('../models/user');

exports.getIndexPage = (req, res, next) => {
    res.render('serviceDesk/index', {
        docTitle: 'Регистрация заявок'
    });
};

exports.getAboutPage = (req, res, next) => {
    res.render('serviceDesk/about', {
        docTitle: 'Инфо'
    });
};
