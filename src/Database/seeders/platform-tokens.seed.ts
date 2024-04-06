module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("system-tokens", [
      {
        name: "BTC",
        icon: "https://api.iconify.design/cryptocurrency:btc.svg?color=%23888888",
        minimumDepositAmount: 0.00000001,
        address: "sample-1Lbcfr7sAHTD9CgdQo3HTMTkV8ZLK4ZnX71",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      {
        name: "ETH",
        icon: "https://api.iconify.design/cryptocurrency:eth.svg?color=%23888888",
        minimumDepositAmount: 0.00000001,
        address: "sample-1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnXE71",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      {
        name: "USDT",
        icon: "https://api.iconify.design/cryptocurrency:usdt.svg?color=%23888888",
        minimumDepositAmount: 0.00000001,
        address: "sample-1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71D",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      {
        name: "USDC",
        icon: "https://api.iconify.design/cryptocurrency:usdc.svg?color=%23888888",
        minimumDepositAmount: 0.00000001,
        address: "sample-1Lbcfr7sAHTD9CgdQo3HTMTkCV8LK4ZnX71",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("platform-feature-status", null, {});
  },
};
