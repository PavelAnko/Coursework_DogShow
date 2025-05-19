const express = require('express');
const router = express.Router();
const DashboardController = require('../controller/DashboardController.js');

router.get('/', DashboardController.getDashboardPage)
router.get('/api/owner-info', DashboardController.getOwnerInfo)
router.get('/api/owner-dogs', DashboardController.getOwnerDogs)
router.get('/api/exhibitions', DashboardController.getExhibitions)
router.delete('/api/delete-dog/:dogId', DashboardController.deleteDog)
router.post('/logout', DashboardController.logout)
router.get('/api/dog-achievements/:dogId', DashboardController.getDogAchievementsById)

module.exports = router;