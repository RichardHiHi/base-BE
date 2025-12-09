'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SwipeLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SwipeLog.init(
    {
      userId: DataTypes.INTEGER,
      timesheetId: DataTypes.INTEGER,
      swipedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'SwipeLog',
    }
  );
  return SwipeLog;
};
