const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');

router.get('/room/:roomId', furnitureController.getFurnitureByRoom);
router.post('/', furnitureController.addFurniture);
router.put('/:id', furnitureController.updateFurniture);
router.delete('/:id', furnitureController.removeFurniture);

module.exports = router;
