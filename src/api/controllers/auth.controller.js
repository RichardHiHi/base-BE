const userService = require('../services/user.service');
const settingService = require('../services/setting.service');
const { validateEmployee } = require('../validations/user.validation');
const jwt = require('jsonwebtoken');
const STATUS = require('../utils/statusCode');
const { validateSignIn } = require('../validations/auth.validation');
const { ROLE, genPassword } = require('../utils/common');
const bcrypt = require('bcryptjs');

const signUp = async (req, res) => {
  const isExitingPhone = await userService.isExitPhone(req.body.phone);

  if (isExitingPhone) {
    return res
      .status(STATUS.CONFLICT)
      .json({ error: 'số điện thoại đã tồn tại.' });
  }

  const validationResults = validateSignIn(req.body);

  if (validationResults !== true) {
    return res.status(STATUS.BAD_REQUEST).json({ error: validationResults });
  }

  try {
    const result = await userService.createUserWithoutRate({
      ...req.body,
      role: ROLE.EMPLOYEE,
    });
    res
      .status(STATUS.CREATED)
      .json({ message: 'đã đăng ký thành công', user: result });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const isExitPhone = await userService.isExitPhone(req.body.phone);

  if (!isExitPhone) {
    return res
      .status(STATUS.FORBIDDEN)
      .json({ error: 'tài khoản không tồn tại hoặc mật khẩu không đúng.' });
  }

  try {
    const result = await userService.login(req.body.phone, req.body.password);

    if (result) {
      const accessToken = jwt.sign(
        {
          phone: result.phone,
          name: result.name,
          id: result.id,
          role: result.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        {
          phone: result.phone,
          name: result.name,
          id: result.id,
          role: result.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
      );

      await userService.updateUser(result.id, { refreshToken });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });

      res.status(STATUS.OK).json({ result, accessToken });
    } else {
      return res
        .status(STATUS.FORBIDDEN)
        .json({ error: 'tài khoản không tồn tại hoặc mật khẩu không đúng.' });
    }
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ error: 'Vui lòng đăng nhập lại' });

    const user = userService.isExitToken(refreshToken);

    if (!user) return res.sendStatus(STATUS.FORBIDDEN);

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const accessToken = jwt.sign(
      {
        phone: payload.phone,
        name: payload.name,
        id: payload.id,
        role: result.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    );

    res.status(STATUS.OK).json({ accessToken });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    await userService.updateUser(decoded.id, { refreshToken: null });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    });

    return res.status(STATUS.OK).json({ message: 'Đã logout thành công' });
  } catch (err) {
    return res
      .status(STATUS.FORBIDDEN)
      .json({ error: 'Token không hợp lệ hoặc hết hạn' });
  }
};

const getMe = async (req, res) => {
  const id = req.userData.id;

  try {
    const result = await userService.getDetail(id);

    if (!result) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ error: 'Không tìm thấy người dùng.' });
    }

    res.status(STATUS.OK).json({ result: result });
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const user = req.userData;

  try {
    const isExitPhone = await userService.isExitPhone(user.phone);

    if (!isExitPhone) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ error: 'tài khoản không tồn tại hoặc mật khẩu không đúng.' });
    }

    const result = await userService.checkPassWord(
      user.phone,
      req.body.currentPassword
    );

    if (!result) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ error: [{ message: 'Mật khẩu hiện tại không đúng.' }] });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.newPassword, salt);

    await userService.updateUser(user.id, { password: hash });
    const accessToken = jwt.sign(
      {
        phone: result.phone,
        name: result.name,
        id: result.id,
        role: result.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      {
        phone: result.phone,
        name: result.name,
        id: result.id,
        role: result.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );

    await userService.updateUser(result.id, {
      refreshToken,
      isFirstLogin: false,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    res
      .status(STATUS.OK)
      .json({ message: 'Đổi mật khẩu thành công.', accessToken });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const id = req.userData.id;
  const validationResults = validateEmployee(req.body);

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
      .json({ message: 'đã sửa thành công', user: updatedUser });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const id = req.params.id;

  try {
    const isExistUser = await userService.getDetail(id);

    if (!isExistUser) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ error: 'người dùng không tồn tại.' });
    }

    const defaultPassword = await settingService.getDefaultPassword();

    await userService.updateUser(id, {
      password: defaultPassword,
      isFirstLogin: true,
    });

    res.status(STATUS.OK).json({ message: 'đã reset mật khẩu thành công' });
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  login,
  getMe,
  logout,
  signUp,
  refreshToken,
  updateProfile,
  resetPassword,
  changePassword,
};
