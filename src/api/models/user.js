'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '1',
        validate: {
          isIn: [['0', '1']],
        },
      },
      phone: DataTypes.STRING,
      rate: DataTypes.STRING,
      payRateType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '0',
        validate: {
          isIn: [['0', '1']],
        },
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFirstLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.refreshToken;
    return values;
  };

  return User;
};
