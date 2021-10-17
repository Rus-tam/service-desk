const Task = require('../models/tasks');
const User = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.mailTransporterUser,
        pass: process.env.mailTransporterPassword
    }
});

const mailSender = async (worker) => {
    try {
        await transporter.sendMail({
            to: worker.email,
            from: 'Service Desk',
            subject: 'Новое задание!',
            html: '<p>Вы получили новое задание.<br>Зайдите во вкладку "Профиль" в приложение Service Desk</p>'
        });
        console.log(worker.email);
    } catch (e) {
        console.log(e);
    }
};

module.exports = mailSender;