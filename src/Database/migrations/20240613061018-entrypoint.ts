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

    await queryInterface.createTable("entrypoint", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      heroBannerImage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobileHeroBannerImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      benefitBannerImage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobileBenefitBannerImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      marketId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "markets",
          key: "id",
        },
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
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("entrypoint");
  },
};
