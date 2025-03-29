const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

router.post('/createReport', ReportController.createReport);
router.get('/getReports', ReportController.getReports);

router.put('/updateReport', ReportController.updateReport);

module.exports = router;