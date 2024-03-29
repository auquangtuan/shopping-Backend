"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullname: {
        type: Sequelize.STRING(50),
      },
      email: {
        type: Sequelize.STRING(150),
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      address: {
        type: Sequelize.STRING(200),
      },
      password: {
        type: Sequelize.STRING(111),
      },
      role_id: {
        type: Sequelize.INTEGER,
        defaultValue: 2,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
