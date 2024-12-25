const express = require('express');
const router = express.Router();
const BoardgamesController = require('../controllers/boardgamesController');

//CRUD routes
router.get('/:id', BoardgamesController.getBoardgameById);
router.get('', BoardgamesController.getBoardgamesList);

router.post('', BoardgamesController.createBoardgame);
router.put('/:id', BoardgamesController.updateBoardgame);
router.delete('/:id', BoardgamesController.deleteBoardgame);

module.exports = router;