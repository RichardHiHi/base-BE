'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payrolls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // 1. Liên kết với nhân viên
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // 2. Kỳ lương (Từ ngày - Đến ngày)
      period_start: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      period_end: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      // 3. Các cột SNAPSHOT (Lưu cứng dữ liệu lúc tính)
      total_work_hours: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        comment: 'Tổng giờ làm (cho Part-time)',
      },
      total_unpaid_leave_days: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        comment: 'Số ngày nghỉ trừ lương (cho Full-time)',
      },
      applied_rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Mức lương áp dụng tại thời điểm tính',
      },
      // 4. Các khoản thêm bớt
      bonus: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      deduction: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      // 5. Con số cuối cùng (Thực lĩnh)
      final_salary: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      // 6. Trạng thái quy trình
      status: {
        type: Sequelize.ENUM('DRAFT', 'APPROVED', 'PAID'),
        defaultValue: 'DRAFT',
      },
      // 7. Timestamp & Xóa mềm
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payrolls');
  },
};
