const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const SECRET = process.env.SECRET;

const auth = async (req, res, next) => {
    try {
        const token = req.header;
        console.log(token);
        next();
    } catch (e) {
        res.send('Что-то пошло не так');
    }
};

module.exports = auth;
