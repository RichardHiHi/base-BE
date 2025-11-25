const Validator = require('fastest-validator');

const v = new Validator({
  messages: {
    required: "Trường '{field}' là bắt buộc!",
    stringMin: "Trường '{field}' phải có ít nhất {expected} ký tự!",
    stringMax: "Trường '{field}' chỉ được tối đa {expected} ký tự!",
    email: "Trường '{field}' phải là email hợp lệ!",
    number: "Trường '{field}' phải là số!",
    enumValue:
      "Trường '{field}' chỉ được là một trong các giá trị: {expected}!",
    stringPattern: "Trường '{field}' không đúng định dạng!",
    stringEmpty: "Trường '{field}' không được để trống!",
    boolean: "Trường '{field}' phải là giá trị đúng hoặc sai!",
    string: "Trường '{field}' phải là string",
  },
});

module.exports = v;
