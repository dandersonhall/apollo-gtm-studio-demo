const { faker } = require('@faker-js/faker');
const { setTimeout } = require('timers/promises');

function generateWarehouseData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "W" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake warehouse data with a random delay
  warehouse = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      addressId: "L" + faker.random.numeric(6),
      aisles: generateMultipleAisles(10)
    }
  );

  return warehouse;
};

function generateApproxLocationData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "AL" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake approx location data with a random delay
  approx_location = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      warehouse: generateWarehouseData(),
      aisle: generateAisleData(),
      bin: generateBinData(),
      quantityOnHand: Math.round(Math.random() * 50)
    }
  );

  return approx_location;
};

function generateAisleData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "ASL" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake aisle data with a random delay
  aisle = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      bins: generateMultipleBins(10)
    }
  );

  return aisle;
};

function generateMultipleAisles( numberToGenerate ){
  let aisles =[];

  for (let i = 0; i < numberToGenerate; i++) {
    aisle = generateAisleData();

    aisles.push(aisle);
  }
  
  return aisles;
};

function generateBinData ( id ) {
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake bin data with a random delay
  bin = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      shelfNumber: Math.round(Math.random() * 100),
      products: generateMultipleProductInventories(5)
    }
  );

  return bin;
};

function generateMultipleBins( numberToGenerate ){
  let bins =[];

  for (let i = 0; i < numberToGenerate; i++) {
    bin = generateBinData();

    bins.push(bin);
  }
  
  return bins;
};

function generateProductInventoryData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "P" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake product inventory data with a random delay
  product_inv = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      productId: id,
      quantityOnHand: Math.round(Math.random() * 100)
    }
  );

  return product_inv;
};

function generateMultipleProductInventories( numberToGenerate ){
  let product_invs =[];

  for (let i = 0; i < numberToGenerate; i++) {
    product_inv = generateProductInventoryData();

    product_invs.push(product_inv);
  }
  
  return product_invs;
};

function generateDeliveryEstimates() {
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake delivery estimate data with a random delay
  deliver_est = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      estimatedDelivery: "3 - 5 days",
      fastestDelivery: "Next Day"
    }
  );

  return deliver_est;
};

module.exports = { generateWarehouseData, generateApproxLocationData, generateDeliveryEstimates }