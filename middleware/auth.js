const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const SECRET = process.env.SECRET;

const auth = async (req, res, next) => {
    try {
        const token = req.cookies['access_token'].replace('Bearer ', '');
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;

        req.user.role === 'Admin' ? req.isAdmin = true : req.isAdmin = false;

        next();
    } catch (e) {
        res.redirect('/authorization-request');
    }
};

module.exports = auth;
