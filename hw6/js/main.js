
// Bar chart configurations: data keys and chart titles
var configs = [
	{ key: "ownrent", title: "Own or Rent" },
	{ key: "electricity", title: "Electricity" },
	{ key: "latrine", title: "Latrine" },
	{ key: "hohreligion", title: "Religion" }
];


// Initialize variables to save the charts later
var barcharts = [];
var areachart;


// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y-%m-%d").parse;


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new are chart object

d3.csv("data/household_characteristics.csv", function(data){

	// * TO-DO *
	console.log(data);

	// make a bar chart for each variable (entry in config)
	var parentElement = "#bar-chart-holder";
	var barCharts = configs.map(function(entry) {
		return new BarChart(parentElement, data, entry);
	});

});


// React to 'brushed' event and update all bar charts
function brushed() {

	// * TO-DO *

}
