const express = require('express');
const router = express.Router();
const ReserveController = require('../controllers/reserveController');

router.get('getReservation/:id', ReserveController.getReservationById);

//router.put('/updateReservation/:id', ReserveController.updateReservationById);

router.post('/createReservation', ReserveController.createReservation);

module.exports = router;