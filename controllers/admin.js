const User = require('../models/user')

exports.getNewUserPage = (req, res, next) => {
    res.render('admin/newUser', {
        docTitle: 'Новый пользователь'
    });
};

exports.postNewUser = async (req, res, next) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const patronymic = req.body.patronymic;
    const department = req.body.department;
    const location = req.body.location;
    const position = req.body.position;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const role = req.body.role;

    try {
        const user = new User({
            name,
            surname,
            patronymic,
            department,
            location,
            position,
            email,
            phone,
            password,
            role
        });
        await user.save();
        await user.generateAuthToken();
        await res.redirect('/');
    } catch (e) {
      res.status(400).send('Something goes wrong');
    };
};


