'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Timesheets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // 1. Liên kết với User
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // 2. Ngày công logic (Chỉ lưu ngày, không giờ)
      workingDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      // 3. Giờ vào
      checkInAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // 4. Giờ ra (Cho phép NULL vì lúc mới Check-in chưa có giờ ra)
      checkOutAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // 5. Tổng giờ (Mặc định là 0)
      totalHours: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      // 6. Trạng thái (ENUM)
      status: {
        type: Sequelize.ENUM('WORKING', 'COMPLETED', 'MISSING_CHECKOUT'),
        defaultValue: 'WORKING',
      },
      // 7. Khóa ngoại liên kết bảng Lương (Cho phép Null khi chưa chốt lương)
      payrollId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Payrolls',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Xóa bảng lương thì set về null để tính lại
      },
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
    await queryInterface.dropTable('Timesheets');
  },
};
