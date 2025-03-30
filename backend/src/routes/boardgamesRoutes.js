const express = require('express');
const router = express.Router();
const BoardgamesController = require('../controllers/boardgamesController');

router.get('/', BoardgamesController.getBoardgamesList);
router.get('/recommended', BoardgamesController.getRecommendedBoardgames);

router.post('', BoardgamesController.createBoardgame);
router.put('/:id', BoardgamesController.updateBoardgame);
router.delete('/:id', BoardgamesController.deleteBoardgame);

module.exports = router;