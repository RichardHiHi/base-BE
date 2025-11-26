const settingService = require('../services/setting.service');
const { genPassword } = require('../utils/common');
const STATUS = require('../utils/statusCode');

const changeDefaultPassword = async (req, res) => {
  const newPassword = req.body.passWord;
  console.log('newPassword:', newPassword);

  try {
    const password = await genPassword(newPassword);

    await settingService.changeDefaultPassword(password);

    res.status(STATUS.OK).json({ message: 'đã đổi mật khẩu thành công' });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = { changeDefaultPassword };
