module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("users", [
      {
        firstName: "Daniel",
        lastName: "Daniel",
        email: "ddd@gmail.com",
        isEmailVerified: false,
        password:
          "$2b$10$vREJbtllPjX4b1AcxI7o8OQDG2cKzglgXZoDnqdSNd4XQ5XWv.YTe", //cccddedded
        isSubscriptionActive: false,
        passwordRecoveryCode: null,
        emailVerificationCode: "sdsfdf",
        acceptedTCAndPP: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
