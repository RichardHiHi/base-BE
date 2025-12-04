'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Leaves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // 1. Liên kết với User
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
      // 2. Ngày nghỉ (Chỉ cần ngày)
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      // 3. Lý do (Ốm, Việc riêng...)
      reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // 4. Có được trả lương không?
      // Quan trọng: Mặc định là FALSE (Nghỉ là trừ lương)
      is_paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // 5. Liên kết bảng Lương (Để khóa dữ liệu sau khi chốt)
      payroll_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Payrolls',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      // 6. Xóa mềm
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Leaves');
  },
};
