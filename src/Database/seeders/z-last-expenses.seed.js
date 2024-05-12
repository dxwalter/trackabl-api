const dayjs = require("dayjs");
const categoryIds = [1, 2, 3, 4];
const subcategories = [
  {
    categoryId: 1,
    subcategoryId: 1,
  },
  {
    categoryId: 1,
    subcategoryId: 2,
  },
  {
    categoryId: 1,
    subcategoryId: 3,
  },
  {
    categoryId: 1,
    subcategoryId: 4,
  },
  {
    categoryId: 2,
    subcategoryId: 5,
  },
  {
    categoryId: 2,
    subcategoryId: 6,
  },
  {
    categoryId: 2,
    subcategoryId: 7,
  },
  {
    categoryId: 3,
    subcategoryId: 8,
  },
  {
    categoryId: 3,
    subcategoryId: 9,
  },
  {
    categoryId: 3,
    subcategoryId: 10,
  },

  {
    categoryId: 4,
    subcategoryId: 11,
  },

  {
    categoryId: 4,
    subcategoryId: 12,
  },

  {
    categoryId: 4,
    subcategoryId: 13,
  },
];

const currencyIds = [
  {
    id: 42,
    currencyCode: "EUR",
  },
  {
    id: 45,
    currencyCode: "GBP",
  },
  {
    id: 95,
    currencyCode: "NGN",
  },
  {
    id: 134,
    currencyCode: "USD",
  },
];

const notes = [
  "Curabitur at lacus ac velit ornare lobortis. Aenean leo ligulalibero turpis vel mi.",
  "Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum. Fusce convallis metus mauris ac eros.",
  "Praesent ut ligula non mi",
  "Quisque id odio. Donec orci lectus, aliquam ut, faucibus non, euismod id, nulla. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo.",
];

const userId = 1;

function generateRandomValues(listData) {
  const min = 0;
  const max = listData.length - 1;
  const random = Math.floor(Math.random() * (max - min)) + min;
  return listData[random];
}

function getMockExpenses() {
  const days = 1;
  const maxDays = 500;
  const startDate = dayjs("01/05/2023").format("DD/MM/YYYY");

  const newData = [];

  const dailyExpenseCount = [5, 10, 30, 12, 40, 20];

  for (var i = 0; i < maxDays; i++) {
    for (
      let index = 0;
      index < generateRandomValues(dailyExpenseCount);
      index++
    ) {
      const today = new Date(dayjs(startDate).add(i, "day"));
      const expenseDateToUnix = dayjs(today).unix();
      const categorySub = generateRandomValues(subcategories);
      newData.push({
        userId: userId,
        categoryId: categorySub.categoryId,
        subcategoryId: categorySub.subcategoryId,
        currencyId: generateRandomValues(currencyIds).id,
        amount: generateRandomValues([100, 500, 1000, 3000, 4000, 5000]),
        receipt: null,
        note: generateRandomValues(notes),
        expenseDateInUnixTimestamp: expenseDateToUnix,
        expenseDate: today,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return newData;
}

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("expenses", getMockExpenses());
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("expenses", null, {});
  },
};
