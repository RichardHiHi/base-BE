const controller = require('../controllers/attendance.controller');
const express = require('express');
const middleware = require('../middleware/check-auth');
const roleMiddleware = require('../middleware/check-role');
const { ROLE } = require('../utils/common');

const router = express.Router();

router.get('/check-in', middleware.checkAuth, controller.checkIn);

module.exports = router;
