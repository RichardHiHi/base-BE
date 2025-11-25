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

module.exports = { userCommonSchema };
