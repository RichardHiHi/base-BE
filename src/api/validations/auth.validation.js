const { ROLE } = require('../utils/common');
const v = require('../utils/validator');
const { userCommonSchema } = require('./common.validation');

const signInSchema = {
  ...userCommonSchema,
  role: {
    type: 'string',
    enum: [ROLE.ADMIN, ROLE.EMPLOYEE],
    optional: true,
  },
  password: { type: 'string', min: 6, empty: false },
};

const validateSignIn = v.compile(signInSchema);

module.exports = { validateSignIn };
