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

    await queryInterface.createTable("temporary-remittance", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      systemTokenId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      historyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comments:
          "This field represents id of the transaction on the history table",
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      recipientStatus: {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: false,
        comments:
          "This field represents if the user has successfully sent the funds",
      },
      baseDeploymentStatus: {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: false,
        comments:
          "This field represents if the system has successfully moved the funds from temporal account to base account",
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

    await queryInterface.dropTable("temporal-remittance");
  },
};
