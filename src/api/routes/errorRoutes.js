const express = require('express');
const router = express.Router();
const ErrorController = require('../controller/ErrorController.js');

router.get('/404', ErrorController.handle404)
router.get('/403', ErrorController.handle403);
router.get('/500', ErrorController.handle500);

module.exports = router;