module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("subscription-plans", [
      {
        name: "Free",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Regular",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Premium",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("subscription-plans", null, {});
  },
};
