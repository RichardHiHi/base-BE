const models = require('../models');
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userData.password, salt);
  userData.password = hash;
  const result = await models.User.create(userData);
  return result;
};

const createUserWithoutRate = async (userData) => {
  delete userData.rate;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userData.password, salt);
  userData.password = hash;
  const result = await models.User.create(userData);
  return result;
};

const getList = async () => {
  const result = await models.User.findAll();
  return result;
};

const updateUser = async (id, userData) => {
  const result = await models.User.update(userData, {
    where: { id: id },
  });
  return result;
};

const getDetail = async (id) => {
  const result = await models.User.findOne({
    where: { id: id },
  });
  return result;
};

const removeUser = async (id) => {
  const result = await models.User.destroy({
    where: { id: id },
  });
  return result;
};

const isExitPhone = async (phone) => {
  const result = await models.User.findOne({
    where: { phone },
  });
  return result;
};

const isExitToken = async (refreshToken) => {
  const result = await models.User.findOne({
    where: { refreshToken },
  });
  return result;
};

const login = async (phone, password) => {
  const user = await models.User.findOne({
    where: { phone },
  });

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

const checkPassWord = login;

module.exports = {
  createUser,
  getList,
  updateUser,
  removeUser,
  getDetail,
  isExitPhone,
  createUserWithoutRate,
  login,
  isExitToken,
  checkPassWord,
};
