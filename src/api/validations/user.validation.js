const { ROLE } = require('../utils/common');
const v = require('../utils/validator');
const { userCommonSchema } = require('./common.validation');

const adminSchema = {
  ...userCommonSchema,
  role: {
    type: 'string',
    enum: [ROLE.ADMIN, ROLE.EMPLOYEE],
    optional: true,
  },
  rate: { type: 'string', empty: true },
  payRateType: { type: 'string', empty: true },
};

const employeeSchema = {
  ...userCommonSchema,
};

const validateAdmin = v.compile(adminSchema);
const validateEmployee = v.compile(employeeSchema);

module.exports = { validateAdmin, validateEmployee };
