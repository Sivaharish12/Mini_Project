'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const user=models.user;
      const product=models.product;
      order.belongsTo(user, {
        foreignKey: 'user_id'
      });
      
      order.belongsTo(product, {
        foreignKey: 'product_id'
      });      

    }
  }
  order.init({
    price: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'order',
  });
  
  return order;
};