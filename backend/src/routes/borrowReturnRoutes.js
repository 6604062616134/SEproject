const express = require('express');
const router = express.Router();
const borrowReturnController = require('../controllers/borrowReturnController');

router.get('', borrowReturnController.getTransactionsList);
router.get('/:id', borrowReturnController.getTransactionById);

router.post('', borrowReturnController.createTransaction);
router.post('/return', borrowReturnController.returnTransaction);

router.put('/:id', borrowReturnController.updateTransaction);
router.delete('/:id', borrowReturnController.deleteTransaction);

module.exports = router;