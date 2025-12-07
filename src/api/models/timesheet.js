'use strict';
const { Model } = require('sequelize');
const { WORKING_STATUS } = require('../utils/common');

module.exports = (sequelize, DataTypes) => {
  class Timesheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. Liên kết với User (Nhân viên)
      // Mối quan hệ: Một Timesheet thuộc về một User
      Timesheet.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Alias để khi query dùng include: ['user']
      });

      // 2. Liên kết với Payroll (Bảng lương)
      // Mối quan hệ: Một Timesheet thuộc về một kỳ lương cụ thể (sau khi chốt)
      Timesheet.belongsTo(models.Payroll, {
        foreignKey: 'payroll_id',
        as: 'payroll',
      });

      // 3. Liên kết với SwipeLogs (Lịch sử quẹt thẻ)
      // Mối quan hệ: Một Timesheet có nhiều lần quẹt thẻ chi tiết
      Timesheet.hasMany(models.SwipeLog, {
        foreignKey: 'timesheet_id',
        as: 'logs',
      });
    }
  }

  Timesheet.init(
    {
      // --- KHÓA NGOẠI ---
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payroll_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Cho phép NULL vì mới tạo chưa có lương
        comment:
          'ID của bảng lương đã chốt. Nếu có giá trị -> Đã khóa, không được sửa.',
      },

      // --- THỜI GIAN ---
      working_date: {
        type: DataTypes.DATEONLY, // Chỉ lưu YYYY-MM-DD
        allowNull: false,
        comment: 'Ngày công logic (tính theo quy tắc 4h sáng)',
      },
      check_in_at: {
        type: DataTypes.DATE, // Lưu YYYY-MM-DD HH:mm:ss
        allowNull: false,
        comment: 'Giờ vào thực tế (Lần quẹt đầu tiên)',
      },
      check_out_at: {
        type: DataTypes.DATE, // Lưu YYYY-MM-DD HH:mm:ss
        allowNull: true, // Mới vào chưa có giờ ra -> Null
        comment: 'Giờ ra thực tế (Lần quẹt cuối cùng)',
      },

      // --- TÍNH TOÁN ---
      total_hours: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        comment: 'Tổng giờ làm đã làm tròn (Block 0.5)',
      },

      // --- TRẠNG THÁI ---
      status: {
        type: DataTypes.ENUM(
          WORKING_STATUS.WORKING,
          WORKING_STATUS.COMPLETED,
          WORKING_STATUS.MISSING_CHECKOUT
        ),
        defaultValue: 'WORKING',
        allowNull: false,
      },

      // --- XÓA MỀM ---
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Timesheet',
      tableName: 'Timesheets', // Tên bảng trong DB
      timestamps: true, // Tự động tạo createdAt, updatedAt
      paranoid: true, // BẬT CHẾ ĐỘ XÓA MỀM (Soft Delete)
      indexes: [
        // Đánh index để query báo cáo cho nhanh
        {
          unique: false,
          fields: ['user_id', 'working_date'],
        },
        {
          unique: false,
          fields: ['payroll_id'], // Để tìm các dòng thuộc bảng lương nào nhanh hơn
        },
      ],
    }
  );

  return Timesheet;
};
