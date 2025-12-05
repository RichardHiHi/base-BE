const jwt = require('jsonwebtoken');
const STATUS = require('../utils/statusCode');

const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ error: 'No token provided' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }

    return res
      .status(STATUS.UNAUTHORIZED)
      .json({ error: 'Authentication failed' });
  }
};

module.exports = { checkAuth };
