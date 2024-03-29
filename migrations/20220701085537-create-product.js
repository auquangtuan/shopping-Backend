'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.INTEGER
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT('long')
      },
      category_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "Categories",
          key : "id"
        }
      },
      tag_id : {
        type: Sequelize.INTEGER,
        references : {
          model : "Tags",
          key : "id"
        }
      },
      delete : {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      gender_ID : {
        type : Sequelize.INTEGER,
        references : {
          model : "Genders",
          key : "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};