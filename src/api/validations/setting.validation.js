const v = require('../utils/validator');
const { timeRules } = require('./common.validation');

const workingTimeSchema = {
  startTime: timeRules.time,
  workingTime: timeRules.workingTime,
};

const validateWorkingTime = v.compile(workingTimeSchema);

module.exports = { validateWorkingTime };
