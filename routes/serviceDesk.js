const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const serviceDeskController = require('../controllers/serviceDesk');


router.get('/', auth, serviceDeskController.getIndexPage);

router.get('/about', auth, serviceDeskController.getAboutPage);

router.get('/profile', auth, serviceDeskController.getProfile);

router.get('/service-catalog', auth, serviceDeskController.getServiceCatalog);

router.get('/software-problems', auth, serviceDeskController.getProblemDescriptionSoftware);

router.post('/new-software-problem', auth, serviceDeskController.postProblemDescriptionSoftware);

module.exports = router;
