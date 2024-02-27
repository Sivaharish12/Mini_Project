'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const order=models.order;
      user.hasMany(order, {
        foreignKey: 'user_id'
      });      
      
    }
  }
  user.init({
    username: DataTypes.STRING,
    mail: DataTypes.STRING,
    password: DataTypes.STRING,
    confirm_password: DataTypes.STRING,
    mobile: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};