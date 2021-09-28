const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const adminControllers = require('../controllers/admin');

router.get('/new-user', auth, adminControllers.getNewUserPage);

router.post('/new-user', adminControllers.postNewUser);

module.exports = router;