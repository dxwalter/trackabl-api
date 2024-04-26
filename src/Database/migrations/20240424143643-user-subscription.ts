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

    await queryInterface.createTable("user-subscriptions", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      planId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscription-plans",
          key: "id",
        },
      },
      marketId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "markets",
          key: "id",
        },
      },
      priceMarketId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscription-market-prices",
          key: "id",
        },
      },
      startDateInUnix: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      endDateInUnix: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      paymentProviderDetails: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.dropTable("user-subscriptions");
  },
};
