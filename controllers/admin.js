const User = require('../models/user');
const Task = require('../models/tasks');
const workerFinder = require("../utils/workerFinder");
const findProblemSolver = require('../utils/findNewProblemSolver');

exports.getNewUserPage = (req, res, next) => {
    try {
        res.render('admin/newUser', {
            docTitle: 'Новый пользователь',
            isAdmin: req.isAdmin,
            user: req.user,
            activeNewUser: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    };
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
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    };
};

exports.postUpdateUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId});

        user.surname = req.body.surname;
        user.name = req.body.name;
        user.patronymic = req.body.patronymic;
        user.department = req.body.department;
        user.location = req.body.location;
        user.position = req.body.position;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.role = req.body.role;

        req.body.password.length >= 8 ? user.password = req.body.password : null;
        req.body.role !== undefined ? user.role = req.body.role : user.role = req.user.role;

        await user.save();

        await res.redirect('/users');
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    };
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().lean()

        if (req.isAdmin) {
            await res.render('admin/users', {
                docTitle: 'Список пользователей',
                isAdmin: req.isAdmin,
                user: req.user,
                users: users,
                activeUsers: true
            });
        } else {
            await res.redirect('/');
        };
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.userId.replace(':', '');
        const user = await User.find({ _id: userId });
        await res.render('admin/newUser', {
            docTitle: 'Редактирование профиля',
            user: user[0].toJSON(),
            isAdmin: req.isAdmin,
            isEditingMode: true
        });
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    }
};

exports.postDeleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await User.deleteOne({ _id: userId });

        await findProblemSolver(userId);

        await res.redirect('/users');
    } catch (e) {
        res.render('error', {
            docTitle: 'Ошибка',
            message: 'Что-то пошло не так!',
            error: e
        });
    }
};

