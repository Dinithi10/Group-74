const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');

router.get('/', designController.getDesigns);
router.post('/', designController.createDesign);
router.delete('/:id', designController.deleteDesign);

module.exports = router;
