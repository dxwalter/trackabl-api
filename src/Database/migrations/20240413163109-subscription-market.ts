"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("markets", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      countryName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currencyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currencySymbol: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('markets');
     */
    await queryInterface.dropTable("markets");
  },
};
