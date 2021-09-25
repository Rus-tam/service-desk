const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/admin');

router.get('/new-user', adminControllers.getNewUserPage);

router.post('/new-user', adminControllers.postNewUser);

module.exports = router;