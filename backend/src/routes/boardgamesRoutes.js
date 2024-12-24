const express = require('express');
const router = express.Router();
const BoardgamesController = require('../controllers/boardgamesController');

//CRUD routes
//router.get('/', userController.getAllBoardgames);
router.get('/:id', BoardgamesController.getBoardgameById);
router.get('/name/:name', BoardgamesController.getBoardgamesByName);
router.get('/level/:level', BoardgamesController.getBoardgameByLevel);
//router.get('/category/:category', BoardgamesController.getBoardgameByCategory);
router.get('/borrowed/:borrowed', BoardgamesController.getBoardgameByBorrowedTimes);

router.post('/', BoardgamesController.createBoardgame);
router.put('/:id', BoardgamesController.updateBoardgame);
router.delete('/:id', BoardgamesController.deleteBoardgame);

module.exports = router;