const userService = require('../services/user.service');
const {
  validateEmployee,
  validateAdmin,
} = require('../validations/user.validation');
const STATUS = require('../utils/statusCode');
const { ROLE } = require('../utils/common');

const save = async (req, res) => {
  const isExitingPhone = await userService.isExitPhone(req.body.phone);

  if (isExitingPhone) {
    return res
      .status(STATUS.CONFLICT)
      .json({ error: 'số điện thoại đã tồn tại.' });
  }

  const validationResults = validateAdmin(req.body);

  if (validationResults !== true) {
    return res.status(STATUS.BAD_REQUEST).json({ error: validationResults });
  }

  const user = { ...req.body, password: '123456', isFirstLogin: true };

  try {
    const result = await userService.createUser(user);
    res
      .status(STATUS.CREATED)
      .json({ message: 'đã tạo thành công', user: result });
  } catch (err) {
    console.log('err:', err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await userService.getList();
    res.status(STATUS.OK).json({ data: result });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;
  const currentUserId = req.userData.id;

  if (id == currentUserId)
    return res
      .status(STATUS.FORBIDDEN)
      .json({ error: 'không thể xóa chính mình' });

  try {
    const user = await userService.getDetail(id);
    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ error: 'Người dùng không tồn tại.' });
    }

    await userService.removeUser(id);

    res.status(STATUS.OK).json({ message: 'đã xóa thành công' });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const showDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userService.getDetail(id);

    if (!result) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ error: 'Không tìm thấy người dùng.' });
    }

    res.status(STATUS.OK).json({ user: result });
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const validationResults =
    req.userData.role === ROLE.ADMIN
      ? validateAdmin(req.body)
      : validateEmployee(req.body);

  if (validationResults !== true) {
    return res.status(STATUS.BAD_REQUEST).json({ error: validationResults });
  }

  try {
    const isExistUser = await userService.getDetail(id);

    if (!isExistUser) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ error: 'người dùng không tồn tại.' });
    }

    await userService.updateUser(id, req.body);
    const updatedUser = await userService.getDetail(id);
    if (req.userData.role === ROLE.EMPLOYEE) {
      delete updatedUser.rate;
      delete updatedUser.role;
      delete updatedUser.payRateType;
    }
    res
      .status(STATUS.OK)
      .json({ message: 'Cập nhật thành công', user: updatedUser });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  save,
  show,
  update,
  destroy,
  showDetail,
};
