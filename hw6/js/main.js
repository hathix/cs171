// Bar chart configurations: data keys and chart titles
var configs = [{
  key: "ownrent",
  title: "Own or Rent" 
}, {
  key: "electricity",
  title: "Electricity" 
}, {
  key: "latrine",
  title: "Latrine" 
}, {
  key: "hohreligion",
  title: "Religion" 
}];


// Initialize variables to save the charts later
var barcharts = [];
var areachart;


// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y-%m-%d")
  .parse;

// store charts
var barCharts;
var areaChart;


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new are chart object

d3.csv("data/household_characteristics.csv", function(data) {

  // * TO-DO *
  console.log(data);

  // make a bar chart for each variable (entry in config)
  barCharts = configs.map(function(entry) {
    return new BarChart("#bar-chart-holder", data, entry);
  });

  // make an area chart to show # of surveys
  areaChart = new AreaChart("#area-chart-holder", data);

});


// React to 'brushed' event and update all bar charts
function brushed() {

  barCharts.forEach(function(barChart) {
    barChart.selectionChanged(
      areaChart.brush.empty() ? areaChart.x.domain() : areaChart.brush.extent()
    );
  })


}
