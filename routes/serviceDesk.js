const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const serviceDeskController = require('../controllers/serviceDesk');


router.get('/', auth, serviceDeskController.getIndexPage);

router.get('/about', auth, serviceDeskController.getAboutPage);

module.exports = router;
