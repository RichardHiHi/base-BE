const settingService = require('../services/setting.service');
const { genPassword } = require('../utils/common');
const STATUS = require('../utils/statusCode');
const { validateWorkingTime } = require('../validations/setting.validation');

const changeDefaultPassword = async (req, res) => {
  const newPassword = req.body.passWord;

  try {
    const password = await genPassword(newPassword);

    await settingService.changeDefaultPassword(password);

    res.status(STATUS.OK).json({ message: 'đã đổi mật khẩu thành công' });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const changeWorkingTime = async (req, res) => {
  const startTime = req.body.startTime;
  const workingTime = req.body.workingTime;

  const validationResults = validateWorkingTime({
    startTime,
    workingTime,
  });

  if (validationResults !== true) {
    return res.status(STATUS.BAD_REQUEST).json({ error: validationResults });
  }

  try {
    await settingService.changeWorkingTime(startTime, workingTime);
    res.status(STATUS.OK).json({ message: 'đã đổi thời gian thành công' });
  } catch {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const showWorkingTime = async (req, res) => {
  try {
    const workingTime = await settingService.getWorkingTime();
    res.status(STATUS.OK).json(workingTime);
  } catch {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = { changeDefaultPassword, changeWorkingTime, showWorkingTime };
