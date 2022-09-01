const { faker } = require('@faker-js/faker');
const { setTimeout } = require('timers/promises');

function generateCustomerData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "C" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake customer data with a random delay
  customer = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      email: faker.internet.email(),
      contactNumber: faker.phone.number(),
      addressId: "L" + faker.random.numeric(6)
    }
  );

  return customer;
};

module.exports = { generateCustomerData }