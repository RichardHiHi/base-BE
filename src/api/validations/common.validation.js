const userCommonSchema = {
  name: { type: 'string', min: 3, max: 255, empty: false },
  email: { type: 'email', empty: false, optional: true },
  phone: {
    type: 'string',
    optional: true,
    pattern: /^0[35789][0-9]{8}$/,
    messages: {
      stringPattern:
        'Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (VD: 0987654321).',
    },
  },
};

const timeRules = {
  time: {
    type: 'string',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$', // HH:mm
    messages: {
      stringPattern: "'{field}' phải có dạng HH:mm (ví dụ: 08:30)",
      string: "'{field}' phải là chuỗi ký tự",
    },
  },

  date: {
    type: 'string',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$', // YYYY-MM-DD
    messages: {
      stringPattern: "'{field}' phải có dạng YYYY-MM-DD (ví dụ: 2025-12-04)",
      string: "'{field}' phải là chuỗi ký tự",
    },
  },

  dateTime: {
    type: 'string',
    pattern: '^\\d{4}-\\d{2}-\\d{2} ([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$', // datetime
    messages: {
      stringPattern:
        "'{field}' phải có dạng YYYY-MM-DD HH:mm:ss (ví dụ: 2025-12-04 14:30:00)",
      string: "'{field}' phải là chuỗi ký tự",
    },
  },

  workingTime: {
    type: 'number',
    integer: true,
    min: 1,
    max: 24,
    convert: true, // chuyển string -> number
  },
};

module.exports = timeRules;

module.exports = { userCommonSchema, timeRules };
