const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const accessLimitation = require('../middleware/accessLimitation');

const adminControllers = require('../controllers/admin');

router.get('/new-user', auth, accessLimitation, adminControllers.getNewUserPage);

router.post('/new-user', auth, accessLimitation, adminControllers.postNewUser);

router.post('/update-user', auth, accessLimitation, adminControllers.postUpdateUser);

router.get('/users', auth, accessLimitation, adminControllers.getUsers);

router.get('/user/:userId', auth, accessLimitation, adminControllers.getUser);

router.post('/delete-user/:userId', auth, accessLimitation, adminControllers.postDeleteUser);

module.exports = router;