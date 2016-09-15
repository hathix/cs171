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

  // filter by type of attraction, if applicable
  var selectBox = document.getElementById("attraction-category");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  var validAttractions;
  if (selectedValue == "all") {
    // if selectedValue is all, then no need to filter b/ everythign is applicable
    validAttractions = attractions;
  } else {
      // otherwise choose only the ones of the selected type
    validAttractions = attractions.filter(function(value) {
      return value.Category == selectedValue;
    });
  }
  // find the top 5 global attractions by # of visitors
  // sort by # of visitors
  validAttractions.sort(function(a, b) {
    return b.Visitors - a.Visitors;
  });
  // choose just the top 5
  top5 = validAttractions.filter(function(value, index) {
    return index < 5;
  });

  // render
  renderBarChart(top5);
}

/**
 * Called whenever the select box is updated.
 */
function dataManipulation() {
    // re-render chart
  dataFiltering();
}
