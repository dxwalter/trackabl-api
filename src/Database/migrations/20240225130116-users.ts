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
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      isSubscriptionActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        unique: false,
      },
      activeSubscriptionId: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        unique: false,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        unique: false,
      },
      emailVerificationCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      passwordRecoveryCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      acceptedTCAndPP: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable("users");
  },
};
