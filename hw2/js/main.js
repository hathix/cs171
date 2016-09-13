// DATASETS

// Global variable with 1198 pizza deliveries
console.log(deliveryData);

// Global variable with 200 customer feedbacks
console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization();

function createVisualization() {

  /* ************************************************************
   *
   * ADD YOUR CODE HERE
   * (accordingly to the instructions in the HW2 assignment)
   *
   * 1) Filter data
   * 2) Display key figures
   * 3) Display bar chart
   * 4) React to user input and start with (1)
   *
   * ************************************************************/

  // 2. gather dataset summary
  // deliveries
  var numberDeliveries = deliveryData.length;
  var numberPizzasDelivered = deliveryData.reduce(function(counter, delivery) {
    return counter + delivery.count;
  }, 0);
  var totalDeliveryTime = deliveryData.reduce(function(counter, delivery) {
    return counter + delivery.delivery_time;
  }, 0);
  var averageDeliveryTime = totalDeliveryTime / numberDeliveries;
  var totalSales = deliveryData.reduce(function(counter, delivery) {
    return counter + delivery.price;
  }, 0);

  // feedback
  var numFeedbacks = feedbackData.length;
  var numFeedbacksByCategory = {
    low: getFeedbacksByQuality("low").length,
    medium: getFeedbacksByQuality("medium").length,
    high: getFeedbacksByQuality("high").length
  };

  // 2. show summary stats
  $('#number-deliveries').html(numberDeliveries);
  $('#total-pizzas-delivered').html(numberPizzasDelivered);
  $('#average-delivery-time').html(averageDeliveryTime);
  $('#total-sales').html(totalSales);

  $('#total-feedbacks').html(numFeedbacks);
  $('#number-high-feedbacks').html(numFeedbacksByCategory.high);
  $('#number-medium-feedbacks').html(numFeedbacksByCategory.medium);
  $('#number-low-feedbacks').html(numFeedbacksByCategory.low);
}

/**
 * Returns the subset of all feedbacks with the given level of quality ("low", "medium", "high").
 */
function getFeedbacksByQuality(quality) {
  return feedbackData.filter(function(feedback) {
    return feedback.quality == quality;
  });
}
