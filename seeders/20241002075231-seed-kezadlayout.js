"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "KezadLayouts",
      [
        {
          id: Sequelize.UUIDV4(),
          ScreenName: "WaveScreen",
          ActiveLayout: "Default",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.UUIDV4(),
          ScreenName: "customerTestimonials",
          ActiveLayout: "Default",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("KezadLayouts", null, {});
  },
};
