'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    static associate(models) {
      // Leave thuộc về 1 User
      Leave.belongsTo(models.User, { foreignKey: 'user_id' });

      // Leave thuộc về 1 kỳ trả lương (Payroll)
      Leave.belongsTo(models.Payroll, { foreignKey: 'payroll_id' });
    }
  }

  Leave.init(
    {
      userId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      reason: DataTypes.STRING,
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      payrollId: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Leave',
      tableName: 'Leaves',
      timestamps: true,
      paranoid: true, // Bật xóa mềm
    }
  );

  return Leave;
};
