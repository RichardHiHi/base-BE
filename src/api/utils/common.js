const bcrypt = require('bcryptjs');

const ROLE = {
  ADMIN: '0',
  EMPLOYEE: '1',
};

const WORKING_STATUS = {
  WORKING: 'WORKING',
  COMPLETED: 'COMPLETED',
  MISSING_CHECKOUT: 'MISSING_CHECKOUT',
};

const genPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

module.exports = { ROLE, genPassword, WORKING_STATUS };
