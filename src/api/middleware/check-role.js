const STATUS = require('../utils/statusCode');

const checkRole = (...roles) => {
  return (req, res, next) => {
    const user = req.userData;

    if (!user) {
      return res.status(STATUS.FORBIDDEN).json({ error: 'Unauthenticated' });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(STATUS.FORBIDDEN)
        .json({ error: 'Forbidden: role không hợp lệ' });
    }

    next();
  };
};

module.exports = { checkRole };
