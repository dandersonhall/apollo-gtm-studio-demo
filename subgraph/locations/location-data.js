const { faker } = require('@faker-js/faker');
const { setTimeout } = require('timers/promises');

function generateLocationData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "L" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake customer data with a random delay
  location = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      address1: faker.address.buildingNumber(),
      address2: faker.address.street(),
      city: faker.address.cityName(),
      country: "United States",
      countryCode: "US"
    }
  );

  return location;
};

module.exports = { generateLocationData }