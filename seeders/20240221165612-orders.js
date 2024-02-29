'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('orders',[{
    id:1,
    product_id: 1,
    name:'iphone',
    price:120000,
    user_id:1,
    quantity:2,
    createdAt:new Date(),
    updatedAt:new Date()
   },
   {
    id:2,
    product_id: 2,
    name:'macbook m3',
    price:350000,
    user_id:1,
    quantity:1,
    createdAt:new Date(),
    updatedAt:new Date()
   },
  ])
  },

  //async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  //}
};
