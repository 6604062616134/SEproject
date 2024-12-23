const express = require('express');
const router = express.Router();
const userController = require('../controllers/boardgamesController');

//CRUD routes
router.get('/', userController.getAllBoardgames);
router.get('/:id', userController.getBoardgameById);

router.post('/', userController.createBoardgame);
router.put('/:id', userController.updateBoardgame);
router.delete('/:id', userController.deleteBoardgame);

module.exports = router;