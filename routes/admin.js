const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const adminControllers = require('../controllers/admin');

router.get('/new-user', auth, adminControllers.getNewUserPage);

router.post('/new-user', auth, adminControllers.postNewUser);

router.post('/update-user', auth, adminControllers.postUpdateUser);

router.get('/users', auth, adminControllers.getUsers);

router.get('/user/:userId', auth, adminControllers.getUser);

router.post('/delete-user/:userId', auth, adminControllers.postDeleteUser);

module.exports = router;