const { faker } = require('@faker-js/faker');
const { setTimeout } = require('timers/promises');

function generateCheckoutData ( id, cart_status ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "CH" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Set values for checkout amounts
  subtotal = 1 + Math.random() * 999;
  taxes = subtotal * 0.2;
  shipping = 5;
  total = subtotal + taxes + shipping;

  // Generate fake checkout data with a random delay
  checkout = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      orderId: "O" + faker.random.numeric(6),
      status: cart_status,
      customerId: "C" + faker.random.numeric(6),
      subtotal: generateMoneyData(subtotal),
      taxes: generateMoneyData(taxes),
      shipping: generateMoneyData(shipping),
      total: generateMoneyData(total)
    }
  );

  return checkout;
};

function generateMoneyData(amount){
  money = {
    amount: (amount.toFixed(2)),
    currencyCode: "USD"
  };

  return money;
};

module.exports = { generateCheckoutData }