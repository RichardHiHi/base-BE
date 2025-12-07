const models = require('../models');
const { WORKING_STATUS } = require('../utils/common');
const dayjs = require('../utils/dayjs');

const checkIn = async (user) => {
  const date = dayjs();
  const workingDate = date.format('YYYY-MM-DD');
  const now = date.format('YYYY-MM-DD HH:mm:ss');
  console.log(now);
  // const timesheet = {
  //   user_id: user.id,
  //   working_date: day,
  //   check_in_at: time,
  //   check_out_at: time,
  //   total_hours: '2h',
  //   status: WORKING_STATUS.WORKING,
  // };

  const [ts, created] = await models.Timesheet.findOrCreate({
    where: {
      user_id: user.id,
      working_date: workingDate,
    },
    defaults: {
      user_id: user.id,
      working_date: workingDate,
      check_in_at: now,
      status: WORKING_STATUS.WORKING,
    },
  });

  if (!created) {
    await ts.update({
      check_out_at: now,
      status: WORKING_STATUS.COMPLETED,
    });
  }

  return ts;
};

module.exports = { checkIn };
