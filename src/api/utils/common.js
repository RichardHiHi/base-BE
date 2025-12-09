const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');

const ROLE = {
  ADMIN: '0',
  EMPLOYEE: '1',
};

const WORKING_STATUS = {
  WORKING: 'WORKING',
  COMPLETED: 'COMPLETED',
  MISSING_CHECKOUT: 'MISSING_CHECKOUT',
};

const genPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const isTimeInRange = (startTime, endTime, checkTime = dayjs()) => {
  let start = dayjs()
    .hour(startTime.split(':')[0])
    .minute(startTime.split(':')[1])
    .second(0);

  let end = dayjs()
    .hour(endTime.split(':')[0])
    .minute(endTime.split(':')[1])
    .second(0);

  // Nếu qua ngày (end < start) → cộng 1 ngày cho end
  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  // Nếu checkTime < start → cộng 1 ngày (ca đêm)

  if (end.isBefore(start)) {
    time = time.add(1, 'day');
  }

  return checkTime.isAfter(start) && checkTime.isBefore(end);
};

module.exports = { ROLE, genPassword, WORKING_STATUS, isTimeInRange };
