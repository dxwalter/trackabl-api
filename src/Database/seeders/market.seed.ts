module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("markets", [
      {
        countryName: "Nigeria",
        countryCode: "NG",
        currencyCode: "NGN",
        currencyName: "Naira",
        currencySymbol: "₦",
        paymentProcessor: "paystack",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        countryName: "United States of America",
        countryCode: "US",
        currencyCode: "USD",
        currencyName: "United States Dollar",
        currencySymbol: "$",
        paymentProcessor: "stripe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("markets", null, {});
  },
};
