const controller = require('../controllers/auth.controller');
const express = require('express');
const middleware = require('../middleware/check-auth');
const roleMiddleware = require('../middleware/check-role');
const { ROLE } = require('../utils/common');

const router = express.Router();

router.post('/sign-up', controller.signUp);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.put('/update-profile', middleware.checkAuth, controller.updateProfile);
router.get('/refresh-token', controller.refreshToken);
router.get('/get-me', middleware.checkAuth, controller.getMe);
router.patch(
  '/change-password',
  middleware.checkAuth,
  controller.changePassword
);

router.get(
  '/reset-password/:id',
  middleware.checkAuth,
  roleMiddleware.checkRole(ROLE.ADMIN),
  controller.resetPassword
);

router.post(
  '/change-default-password',
  middleware.checkAuth,
  roleMiddleware.checkRole(ROLE.ADMIN),
  controller.changePassword
);

module.exports = router;
