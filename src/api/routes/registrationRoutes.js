const express = require('express');
const router = express.Router();
const RegOwnerController = require('../controller/RegOwnerController.js');

router.get('/', RegOwnerController.getRegOwnerPage)
router.post('/user', RegOwnerController.registerOwner);

module.exports = router;