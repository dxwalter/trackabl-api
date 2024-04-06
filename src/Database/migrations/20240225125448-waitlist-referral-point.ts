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

    await queryInterface.createTable("waitlist-points", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      waitlistUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      point: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true,
        comments:
          "This field will be populated when the app goes live and this user comes back to register",
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

    await queryInterface.dropTable("waitlist-points");
  },
};
