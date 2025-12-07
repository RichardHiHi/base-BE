const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// 1. Nạp các plugin cần thiết
dayjs.extend(utc);
dayjs.extend(timezone);

// 2. Thiết lập múi giờ mặc định cho toàn bộ dự án
// Việc này giúp bạn không phải gõ lại chuỗi "Asia/Ho_Chi_Minh" nhiều lần
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

// 3. Xuất biến dayjs đã được "độ" xong
module.exports = dayjs;
