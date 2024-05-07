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
    await queryInterface.addColumn("user-subscriptions", "reference", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
    await queryInterface.addColumn("user-subscriptions", "paymentDetails", {
      type: Sequelize.JSONB,
      allowNull: true,
      unique: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("user-subscriptions", "reference");
    await queryInterface.removeColumn("user-subscriptions", "paymentDetails");
  },
};
