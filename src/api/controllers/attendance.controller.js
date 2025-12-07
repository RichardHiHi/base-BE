const STATUS = require('../utils/statusCode');
const userService = require('../services/user.service');
const attendanceService = require('../services/attendance.service');

const checkIn = async (req, res) => {
  const id = req.userData.id;

  const isExistUser = await userService.getDetail(id);
  if (!isExistUser) {
    return res
      .status(STATUS.NOT_FOUND)
      .json({ error: 'người dùng không tồn tại.' });
  }

  const user = attendanceService.checkIn(isExistUser);

  try {
    return res.status(STATUS.OK).json({ error: user });
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};

module.exports = { checkIn };
