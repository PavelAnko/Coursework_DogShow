const express = require('express');
const router = express.Router();
const RegDogController = require('../controller/RegDogController.js');

router.get('/', RegDogController.getAddDogPage);
router.get('/api/breeds', RegDogController.getBreeds);
router.post('/add-dog', RegDogController.registerDog);

module.exports = router;