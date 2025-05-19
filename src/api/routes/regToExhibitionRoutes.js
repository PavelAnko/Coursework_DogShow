const express = require('express');
const router = express.Router();
const RegToExhibition = require('../controller/RegToExhibition.js');

router.get('/', RegToExhibition.getRegisterDogFormToExhibition);
router.post('/pet', RegToExhibition.registerDogToExhibition);
router.get('/api/owner-registrations', RegToExhibition.getExhibitionRegistrations)
router.get('/available-exhibitions/:dogId', RegToExhibition.getAvailableExhibitionsForDog);

module.exports = router;