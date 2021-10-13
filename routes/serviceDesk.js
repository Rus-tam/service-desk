const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const serviceDeskController = require('../controllers/serviceDesk');



router.get('/', auth, serviceDeskController.getIndexPage);

router.get('/about', serviceDeskController.getAboutPage);

router.get('/profile', auth, serviceDeskController.getProfile);

router.get('/service-catalog', auth, serviceDeskController.getServiceCatalog);

router.get('/software-problems', auth, serviceDeskController.getProblemDescriptionSoftware);

router.get('/office-equipment-problems', auth, serviceDeskController.getProblemDescriptionOfficeEquipment);

router.get('/furniture-problems', auth, serviceDeskController.getProblemDescriptionFurniture);

router.get('/profile-problems', auth, serviceDeskController.getProblemDescriptionAdmin);

router.post('/new-problem', auth, serviceDeskController.postProblemDescription);

router.get('/task-details/:taskId', auth, serviceDeskController.getTaskDetails);

router.post('/set-accepted-time/:taskId', auth, serviceDeskController.postSetAcceptedTime);

router.post('/set-solved-time/:taskId', auth, serviceDeskController.postSetSolvedTime);

module.exports = router;
