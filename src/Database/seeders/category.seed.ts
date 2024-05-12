module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("categories", [
      {
        name: "Housing",
        isUserDefinedCategory: false,
        isCategoryActive: true,
        userId: null,
        icon: "https://res.cloudinary.com/dsvppsml4/image/upload/v1715518787/trackabl/category_icons/house_zwvxsx.svg",
        color: "#CD5C5C",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Transportation",
        isUserDefinedCategory: false,
        isCategoryActive: true,
        userId: null,
        icon: "https://res.cloudinary.com/dsvppsml4/image/upload/v1715518787/trackabl/category_icons/house_zwvxsx.svg",
        color: "#F08080",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Food and Beverages",
        isUserDefinedCategory: false,
        isCategoryActive: true,
        userId: null,
        icon: "https://res.cloudinary.com/dsvppsml4/image/upload/v1715518787/trackabl/category_icons/house_zwvxsx.svg",
        color: "#FA8072",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Insurance",
        isUserDefinedCategory: false,
        isCategoryActive: true,
        userId: null,
        icon: "https://res.cloudinary.com/dsvppsml4/image/upload/v1715518787/trackabl/category_icons/house_zwvxsx.svg",
        color: "#E9967A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
