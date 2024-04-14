module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("admin-users", [
      {
        fullname: "Daniel",
        email: "ccc@gmail.com",
        password:
          "$2b$10$vREJbtllPjX4b1AcxI7o8OQDG2cKzglgXZoDnqdSNd4XQ5XWv.YTe",
        passwordRecoveryCode: null,
        accessLevel: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("admin-users", null, {});
  },
};
