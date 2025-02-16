const express = require('express');
const router = express.Router();
const borrowReturnController = require('../controllers/borrowReturnController');
const { authenticateToken } = require('../middleware/authenticateToken');

router.get('/transactions', borrowReturnController.getTransactionsList);
router.get('/getStatus/:gameId', borrowReturnController.getStatus);
router.get('/:id', borrowReturnController.getTransactionById);

router.post('/',authenticateToken, borrowReturnController.createTransaction);
// router.post('/return', borrowReturnController.returnTransaction);

// router.put('/:id', borrowReturnController.updateTransaction);
// router.delete('/:id', borrowReturnController.deleteTransaction);

module.exports = router;