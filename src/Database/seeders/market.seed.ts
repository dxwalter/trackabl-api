module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("markets", [
      {
        countryName: "Nigeria",
        countryCode: "NG",
        currencyCode: "NGN",
        currencyName: "Naira",
        currencySymbol: "₦",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        countryName: "United States of America",
        countryCode: "USA",
        currencyCode: "USD",
        currencyName: "United States Dollar",
        currencySymbol: "$",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("markets", null, {});
  },
};
