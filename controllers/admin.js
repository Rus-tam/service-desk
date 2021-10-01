const User = require('../models/user')

exports.getNewUserPage = (req, res, next) => {
    if (req.isAdmin) {
        res.render('admin/newUser', {
            docTitle: 'Новый пользователь',
            isAdmin: req.isAdmin,
            user: req.user
        });
    } else {
        res.redirect('/');
    }
};

exports.postNewUser = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            patronymic: req.body.patronymic,
            department: req.body.department,
            location: req.body.location,
            position: req.body.position,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            role: req.body.role
        });
        await user.save();
        await user.generateAuthToken();
        await res.redirect('/');
    } catch (e) {
      res.status(400).send('Something goes wrong');
    };
};


