// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering();

//2.3 array filtering
function dataFiltering() {
  var attractions = attractionData;

  /* **************************************************
   *
   * ADD YOUR CODE HERE (ARRAY/DATA MANIPULATION)
   *
   * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
   *
   * renderBarChart(data)
   *
   * - 'data' must be an array of JSON objects
   * - the max. length of 'data' is 5
   *
   * **************************************************/

  // find the top 5 global attractions by # of visitors
  // sort by # of visitors
  attractions.sort(function(a, b) {
    return a.Visitors < b.Visitors;
  });
  // choose just the top 5
  top5 = attractions.filter(function(value, index) {
    return index < 5;
  });

  // render
  renderBarChart(top5);
}
