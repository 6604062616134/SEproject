const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/getnoti', notificationController.getNotifications);

router.put('/create', notificationController.createNotification);

module.exports = router;