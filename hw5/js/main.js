// SVG drawing area

var margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 60
};

var width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Scales
var x = d3.scale.ordinal()
  .rangeRoundBands([width, 0], .1);

var y = d3.scale.linear()
  .range([height, 0]);

// axes
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var xGroup = svg.append('g')
  .attr('class', 'axis x-axis')
  .attr("transform", "translate(" + 0 + "," + height +
    ")");
var yGroup = svg.append('g')
  .attr('class', 'axis y-axis');
// .attr("transform", "translate(" + (0) + "," + (0) + ")");

// bars
var barGroup = svg.append('g');
// .attr("transform", "translate(" + margin + "," + margin.top + ")");


// prepare the line
var line = d3.svg.line()
    .x(function(d) { return x(formatDate(d.YEAR)); })
    .y(function(d) { return y(d.GOALS); })
    .interpolate("monotone");
var lineGroup = svg.append('path')
	.attr('class', 'line');

// prepare circles
var circleGroup = svg.append('g');

// Initialize data
loadData();

// FIFA world cup
var data;


// Load CSV file
function loadData() {
  d3.csv("data/fifa-world-cup.csv", function(error, csv) {

    csv.forEach(function(d) {
      // Convert string to 'date object'
      d.YEAR = formatDate.parse(d.YEAR);

      // Convert numeric values to 'numbers'
      d.TEAMS = +d.TEAMS;
      d.MATCHES = +d.MATCHES;
      d.GOALS = +d.GOALS;
      d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
      d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
    });

    // Store csv data in global variable
    data = csv;

    // Draw the visualization for the first time
    updateVisualization();
  });
}


// Render visualization
function updateVisualization() {

  console.log(data);

  // update domains
  // x: years
  x.domain(data.map(function(d) {
    return formatDate(d.YEAR);
  }));
  y.domain([0, d3.max(data.map(function(d) {
    return d.GOALS;
  }))]);

  // redraw axes
  xGroup.transition()
      .duration(1000).call(xAxis);
  yGroup.transition()
      .duration(1000).call(yAxis);


	  // redraw line
	lineGroup.attr('d', line(data));


    // circles: enter/update/exit
    // enter
    var circles = circleGroup.selectAll('circle').data(data);
    circles.enter().append('circle').attr('class', 'tooltip-circle');

    // update
    circles.attr('r', 5).attr('cx', function(d) {
        return x(formatDate(d.YEAR))
    }).attr('cy', function(d) {
        return y(d.GOALS)
    });

    // exit
    circles.exit().remove();
}


// Show details for a specific FIFA World Cup
function showEdition(d) {

}
