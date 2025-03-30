const express = require('express');
const router = express.Router();
const borrowReturnController = require('../controllers/borrowReturnController');
//const { authenticateToken } = require('../middleware/authenticateToken');

router.get('/transactions', borrowReturnController.getTransactionsList);
router.get('/getStatus/:gameId', borrowReturnController.getStatus);
router.get('/transactions/:id', borrowReturnController.getTransactionById);
router.get('/borrowed/:userId', borrowReturnController.getBorrowedGames);

// router.put('/transactions/:boardgame_id/borrow', borrowReturnController.updateTransactionStatus);
router.put('/transactions/update', borrowReturnController.updateTransactionStatus);
router.put('/transactions/:game_id/return', borrowReturnController.returnGame);
router.put('/admin/accept', borrowReturnController.adminAcceptRequest);
router.put('/createReturnDate', borrowReturnController.createReturningDate);

// router.post('/create',authenticateToken, borrowReturnController.createTransaction);
router.post('/create', borrowReturnController.createTransaction);
router.post('/admin/reject', borrowReturnController.adminRejectRequest);

module.exports = router;