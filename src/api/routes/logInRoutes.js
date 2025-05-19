const express = require('express');
const router = express.Router();
const LogOwnerController = require('../controller/LogOwnerController.js');

router.get('/', LogOwnerController.getLogOwnerPage)
router.post('/user', LogOwnerController.logInOwner);

module.exports = router;