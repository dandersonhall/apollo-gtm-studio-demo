const { faker } = require('@faker-js/faker');
const { setTimeout } = require('timers/promises');

function generateOrderData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "O" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate a random number of line items
  line_items = generateMultipleLineItems(Math.round(1 + Math.random()*9));

  // Generate fake customer data with a random delay
  order = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      shippingAddressId: "L" + faker.random.numeric(6),
      billingAddressId: "L" + faker.random.numeric(6),
      status: "FULFILLED",
      items: line_items,
      phoneNotifications: null,
      cancelledReason: null
    }
  );

  return order;
};

function generateMultipleOrders( numberToGenerate ){
  let orders =[];

  for (let i = 0; i < numberToGenerate; i++) {
    order = generateOrderData();

    orders.push(order);
  }
  
  return orders;
};

function generateLineItem() {
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake customer data with a random delay
  line_item = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      productId: "P" + faker.random.numeric(6),
      dealPrice: generateMoneyData((1 + Math.random() * 999).toFixed(2)),
      quantityOrdered: Math.round(1 + Math.random()*2),
      stockLocationId: "AL" + faker.random.numeric(6)
    }
  );

  return line_item;
};

function generateMultipleLineItems( numberToGenerate ){
  let line_items =[];

  for (let i = 0; i < numberToGenerate; i++) {
    line_item = generateLineItem();

    line_items.push(line_item);
  }
  
  return line_items;
};

function generateMoneyData(amount){
  money = {
    amount: amount,
    currencyCode: "USD"
  };

  return money;
};

module.exports = { generateOrderData, generateMultipleOrders }