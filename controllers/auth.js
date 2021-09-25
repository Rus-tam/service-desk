const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        docTitle: 'Страница авторизации'
    })
};

exports.postLogin = async (req, res, next) => {
    console.log(req.body.email);
    console.log(req.body.password);
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        await user.generateAuthToken();
        await res.redirect('/');
        //const token = await user.generateAuthToken();
    } catch (e) {
        res.status(400).send('Что-то пошло не так');
    }
};