const { faker } = require('@faker-js/faker');
const { setTimeout } = require('timers/promises');

function generateProductData( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "P" + faker.random.numeric(6);
  }

  // Set minimum and maximum time it takes to generate product data
  // One in every 100 times make this take 1.5s - 1.75s
  if (Math.random() >= 0.99) {
    min_time = 1500;
    max_time = 1750;
  } else {
    min_time = 50;
    max_time = 150;
  }

  // Generate fake product data with a random delay
  product = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      title: faker.commerce.product(),
      url: faker.internet.url(),
      description: faker.commerce.productDescription(),
      price: generatePriceData(),
      salesRank: faker.random.numeric(3),
      salesRankOverall: faker.random.numeric(3),
      salesRankInCategory: faker.random.numeric(3),
      category: "ALL",
      images: [faker.internet.url(), faker.internet.url(), faker.internet.url()],
      primaryImage: faker.internet.url()
    }
  );

  return product;
};

function generateMultipleProducts( numberToGenerate ){
  let products =[];

  for (let i = 0; i < numberToGenerate; i++) {
    product = generateProductData();

    products.push(product);
  }

  return products;
};

function generatePriceData(){
  let cost = (1 + Math.random() * 999).toFixed(2)
  let deal = (Math.random()/4).toFixed(2)
  let dealSavings = (cost * deal).toFixed(2)

  price = {
    cost: generateMoneyData(cost),
    deal: deal,
    dealSavings: generateMoneyData(dealSavings)
  };

  return price
};

function generateMoneyData(amount){
  money = {
    amount: amount,
    currencyCode: "USD"
  };

  return money;
};

function generateDepartmentsData(){
  departments = [];

  categories = ["ALL", "GIFT_CARDS", "ELECTRONICS", "CAMERA_N_PHOTO", "VIDEO_GAMES", "BOOKS", "CLOTHING"];

  // Set minimum and maximum time it takes to generate products data
  const min_time = 50 * categories.length;
  const max_time = 500 * categories.length;


  for (let i = 0; i < categories.length; i++){
    department = {
      category: categories[i],
      url: faker.internet.url()
    }; 

    departments.push(department);
  }

  departments =  setTimeout(min_time + Math.random() * (max_time - min_time), departments);

  return departments;
}

module.exports = { generateProductData, generateMultipleProducts, generateDepartmentsData };