'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Order_Details, Product, Status}) {
      this.belongsTo(User, {foreignKey : "user_ID"})
      this.belongsTo(Status, { foreignKey : "status" })
    }
  }
  Order.init({
    user_ID: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    note: DataTypes.STRING(1000),
    status : DataTypes.INTEGER,
    updateByID : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};