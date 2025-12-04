'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    static associate(models) {
      // 1 Payroll thuộc về 1 User
      Payroll.belongsTo(models.User, { foreignKey: 'user_id' });

      // 1 Payroll sẽ "khóa" nhiều dòng Timesheet và Leave
      // (Quan hệ 1-Nhiều)
      Payroll.hasMany(models.Timesheet, { foreignKey: 'payroll_id' });
      Payroll.hasMany(models.Leave, { foreignKey: 'payroll_id' });
    }
  }

  Payroll.init(
    {
      user_id: DataTypes.INTEGER,
      period_start: DataTypes.DATEONLY,
      period_end: DataTypes.DATEONLY,

      // Snapshot metrics
      total_work_hours: DataTypes.FLOAT,
      total_unpaid_leave_days: DataTypes.FLOAT,
      applied_rate: DataTypes.FLOAT,

      // Money
      bonus: DataTypes.FLOAT,
      deduction: DataTypes.FLOAT,
      final_salary: DataTypes.FLOAT,

      status: DataTypes.ENUM('DRAFT', 'APPROVED', 'PAID'),
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Payroll',
      tableName: 'Payrolls',
      timestamps: true,
      paranoid: true, // Bật xóa mềm
    }
  );

  return Payroll;
};
