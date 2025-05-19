const express = require('express');
const router = express.Router();
const AdminController = require('../../controller/adminController/AdminController.js');

router.get('/', AdminController.getAdminLogInPage)
router.post('/user', AdminController.loginAdmin);
router.get('/dashboard', AdminController.getAdminDashboardPage)
router.get('/api/all-owners', AdminController.getAllOwners)
router.get('/api/owner-dogs/:ownerId', AdminController.getOwnerDogsById)
router.get('/api/dog-achievements', AdminController.getAllDogsAchievements)
router.get('/api/dog-exhibition/:dogId', AdminController.getDogExhibitionById)
router.post('/dashboard-achievement', AdminController.postDogAchievement)
router.post('/removing-dog-exhibition', AdminController.removingDogFromExhibition)
router.get('/api/exhibitions-categories', AdminController.getAllExhibitionsCategories)
router.post('/dashboard-exhibition', AdminController.postExhibitionsByAdmin)

module.exports = router;