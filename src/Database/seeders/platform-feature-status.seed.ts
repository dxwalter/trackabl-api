module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("platform-feature-status", [
      {
        feature: "SIGNUP",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: "LOGIN",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: "DEPOSIT",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("platform-feature-status", null, {});
  },
};
