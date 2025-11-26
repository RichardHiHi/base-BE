const controller = require('../controllers/setting.controller');
const express = require('express');
const middleware = require('../middleware/check-auth');
const roleMiddleware = require('../middleware/check-role');
const { ROLE } = require('../utils/common');
const router = express.Router();

router.post(
  '/change-default-password',
  middleware.checkAuth,
  roleMiddleware.checkRole(ROLE.ADMIN),
  controller.changeDefaultPassword
);

module.exports = router;
