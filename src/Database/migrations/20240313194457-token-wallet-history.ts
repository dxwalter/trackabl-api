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

    await queryInterface.createTable("token-wallet-history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      systemTokenId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      temporalRemittanceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      previousWalletId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      transactionType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tokenName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        comments: "This is the ammount that was either deposited or withdrawn",
      },
      balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      previousTransactionData: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAtInUnixTimestamp: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.dropTable("token-wallet-history");
  },
};
