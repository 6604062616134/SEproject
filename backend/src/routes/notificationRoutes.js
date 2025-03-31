const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/getnotires/:id', notificationController.getReserveNotificationsById);
router.get('/getnotireturn/:id', notificationController.getReturnNotificationsById);

router.put('/createnoti', notificationController.createNotification);

module.exports = router;