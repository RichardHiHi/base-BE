const controller = require('../controllers/user.controller');
const express = require('express');
const authMiddleware = require('../middleware/check-auth');
const roleMiddleware = require('../middleware/check-role');
const { ROLE } = require('../utils/common');

const router = express.Router();

router.post('/', authMiddleware.checkAuth, controller.save);
router.get('/', authMiddleware.checkAuth, controller.show);
router.put('/:id', authMiddleware.checkAuth, controller.update);
router.get('/:id', authMiddleware.checkAuth, controller.showDetail);
router.delete(
  '/:id',
  authMiddleware.checkAuth,
  roleMiddleware.checkRole(ROLE.ADMIN),
  controller.destroy
);

module.exports = router;
