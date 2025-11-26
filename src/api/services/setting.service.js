const models = require('../models');

const getDefaultPassword = async () => {
  const defaultPassword = await models.Setting.findOne({
    where: { key: 'defaultPassword' },
  });
  return defaultPassword.value;
};

const changeDefaultPassword = async (password) => {
  await models.Setting.update(
    { value: password },
    { where: { key: 'defaultPassword' } }
  );
};

module.exports = { getDefaultPassword, changeDefaultPassword };

//
