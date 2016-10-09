// SVG drawing area

var margin = {
  top: 40,
  right: 10,
  bottom: 60,
  left: 60
};

var width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

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
  .attr('class', 'axis')
  .attr("transform", "translate(" + 0 + "," + height +
    ")");
var yGroup = svg.append('g')
  .attr('class', 'axis');
  // .attr("transform", "translate(" + (0) + "," + (0) + ")");

// bars
var barGroup = svg.append('g');
  // .attr("transform", "translate(" + margin + "," + margin.top + ")");


// update graph based on which metric they chose
var rankMetric;

function updateRankMetric() {
  console.log('update');
  rankMetric = d3.select("#ranking-type")
    .property("value");
}
updateRankMetric();

d3.select("#ranking-type")
  .on("change", function() {
      updateRankMetric();
      updateVisualization();
  });

// Initialize data
loadData();

// Coffee chain data
var data;

// Load CSV file
function loadData() {
  d3.csv("data/coffee-house-chains.csv", function(error, csv) {

    csv.forEach(function(d) {
      d.revenue = +d.revenue;
      d.stores = +d.stores;
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


  // sort
  data.sort(function(a, b) {
    return b[rankMetric] - a[rankMetric];
  });

  // update domains
  // x: store names
  x.domain(data.map(function(d) {
    return d.company;
  }));
  y.domain([0, d3.max(data.map(function(d) {
    return d[rankMetric];
  }))]);

  // redraw axes
  xGroup.call(xAxis);
  yGroup.call(yAxis);

  // redraw bars
  var bars = barGroup.selectAll('rect')
    .data(data);

  bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr("x", function(d) {
      return x(d.company);
    })
    .attr("y", function(d) {
      return y(d[rankMetric]);
    })
    .attr("width", x.rangeBand())
    .attr("height", function(d) {
      return height - y(d[rankMetric]);
    });

  bars.exit()
    .remove();

}
