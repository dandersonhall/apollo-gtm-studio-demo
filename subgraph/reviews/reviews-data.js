const { faker } = require('@faker-js/faker');
const { setTimeout } = require('timers/promises');

function generateReviewData ( id ) {
  // If id is defined then return that id, otherwise generate a random id
  if(id === undefined) {
    id = "R" + faker.random.numeric(6);
  }
  
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake customer data with a random delay
  review = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      id: id,
      rating: Math.random() * 5,
      content: faker.lorem.paragraph()
    }
  );

  return review;
};

function generateMultipleReviews( numberToGenerate ){
  let reviews =[];

  for (let i = 0; i < numberToGenerate; i++) {
    review = generateReviewData();

    reviews.push(review);
  }
  
  return reviews;
};

function generateReviewSummary(){
  // Set minimum and maximum time it takes to generate product data
  const min_time = 50;
  const max_time = 150;

  // Generate fake customer data with a random delay
  review_summary = setTimeout(min_time + Math.random() * (max_time - min_time),
    {
      totalReviews: Math.round(Math.random() * 10000),
      averageRating: Math.random() * 5
    }
  );

  return review_summary;
};

module.exports = { generateMultipleReviews, generateReviewSummary }