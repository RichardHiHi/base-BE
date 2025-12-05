const models = require('../models');

const getDefaultPassword = async () => {
  const defaultPassword = await models.Setting.findOne({
    where: { key: 'defaultPassword' },
  });
  return defaultPassword?.value;
};

const changeDefaultPassword = async (password) => {
  await models.Setting.update(
    { value: password },
    { where: { key: 'defaultPassword' } }
  );
};

const changeWorkingTime = async (startTime, workingTime) => {
  await models.Setting.update(
    { value: startTime },
    { where: { key: 'startTime' } }
  );
  await models.Setting.update(
    { value: workingTime },
    { where: { key: 'workingTime' } }
  );
};

const getWorkingTime = async () => {
  const startTime = await models.Setting.findOne({
    where: { key: 'startTime' },
  });
  const workingTime = await models.Setting.findOne({
    where: { key: 'workingTime' },
  });

  const result = {
    startTime: startTime?.value,
    workingTime: workingTime?.value,
  };
  return result;
};

module.exports = {
  getDefaultPassword,
  changeDefaultPassword,
  changeWorkingTime,
  getWorkingTime,
};

//
