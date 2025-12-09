'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    static associate(models) {
      // 1 Payroll thuộc về 1 User
      Payroll.belongsTo(models.User, { foreignKey: 'userId' });

      // 1 Payroll sẽ "khóa" nhiều dòng Timesheet và Leave
      // (Quan hệ 1-Nhiều)
      Payroll.hasMany(models.Timesheet, { foreignKey: 'payrollId' });
      Payroll.hasMany(models.Leave, { foreignKey: 'payrollId' });
    }
  }

  Payroll.init(
    {
      userId: DataTypes.INTEGER,
      periodStart: DataTypes.DATEONLY,
      periodEnd: DataTypes.DATEONLY,

      // Snapshot metrics
      totalWorkHours: DataTypes.FLOAT,
      totalUnpaidLeaveDays: DataTypes.FLOAT,
      appliedRate: DataTypes.FLOAT,

      // Money
      bonus: DataTypes.FLOAT,
      deduction: DataTypes.FLOAT,
      finalSalary: DataTypes.FLOAT,

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
