const models = require('../models');
const { WORKING_STATUS, isTimeInRange } = require('../utils/common');
const dayjs = require('../utils/dayjs');
const { getWorkingTime } = require('./setting.service');

const CHECK_LIMIT = 4;

const checkIn = async (user) => {
  const date = dayjs();
  const workingDate = date.format('YYYY-MM-DD');
  const now = date;
  const formatNow = date.format('YYYY-MM-DD HH:mm:ss');
  // const timesheet = {
  //   user_id: user.id,
  //   working_date: day,
  //   check_in_at: time,
  //   check_out_at: time,
  //   total_hours: '2h',
  //   status: WORKING_STATUS.WORKING,
  // };

  const { endTime, startTime } = await getWorkingTime();

  const isTimeInRange = isTimeInRange(startTime, endTime, now);

  if (!isTimeInRange) {
    throw new Error(`bạn không thế scan ngoài giờ làm`);
  }

  const [timeSheet, created] = await models.Timesheet.findOrCreate({
    where: {
      userId: user.id,
      workingDate: workingDate,
    },
    defaults: {
      userId: user.id,
      workingDate: workingDate,
      checkInAt: formatNow,
      status: WORKING_STATUS.WORKING,
    },
  });

  if (!created) {
    const checkOut = dayjs(timeSheet.check_out_at);
    const diffMinutes = checkOut.diff(now, 'minute');

    if (diffMinutes > CHECK_LIMIT) {
      const totalHours = checkOut.diff(now, 'hour');
      await timeSheet.update({
        checkOutAt: formatNow,
        status: WORKING_STATUS.COMPLETED,
        totalHours,
      });
    } else {
      throw new Error(
        `bạn vừa scan rồi ,vui lòng quay lại sau ${CHECK_LIMIT} phút`
      );
    }
  }

  return timeSheet;
};

module.exports = { checkIn };
