"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: "users", schema: "auth_service" },
      "avatar",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      { tableName: "users", schema: "auth_service" },
      "userName",
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );

    await queryInterface.addColumn(
      { tableName: "users", schema: "auth_service" },
      "firstName",
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );

    await queryInterface.addColumn(
      { tableName: "users", schema: "auth_service" },
      "lastName",
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      { tableName: "users", schema: "auth_service" },
      "avatar"
    );
    await queryInterface.removeColumn(
      { tableName: "users", schema: "auth_service" },
      "userName"
    );
    await queryInterface.removeColumn(
      { tableName: "users", schema: "auth_service" },
      "firstName"
    );
    await queryInterface.removeColumn(
      { tableName: "users", schema: "auth_service" },
      "lastName"
    );
  },
};
