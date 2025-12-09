'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Settings', [
      {
        key: 'defaultPassword',
        value: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'startTime',
        value: '18:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'endTime',
        value: '02:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Settings', {
      key: ['defaultPassword', 'startTime', 'endTime'],
    });
  },
};
