/* VARIABLES */
var margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 60
};

var width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// FIFA world cup
var data;

// store the value to track on the y-axis
var yAxisMetric = "GOALS";

// store the years to show
// [start, end]
var timePeriod = [];

// Scales
var x = d3.scale.linear()
  .range([0, width])

var y = d3.scale.linear()
  .range([height, 0]);


/* SET UP D3 ELEMENTS */
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// axes
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickFormat(d3.format("0000"));
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");
var xGroup = svg.append('g')
  .attr('class', 'axis x-axis')
  .attr("transform", "translate(" + 0 + "," + height +
    ")");
var yGroup = svg.append('g')
  .attr('class', 'axis y-axis');

// prepare the line
var line = d3.svg.line()
  .x(function(d) {
    return x(d.YEAR_INT);
  })
  .y(function(d) {
    return y(d[yAxisMetric]);
  })
  .interpolate("monotone");
var lineGroup = svg.append('path')
  .attr('class', 'line');

// prepare circles
var circleGroup = svg.append('g');

// initialize tooltip
var tooltip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    return d.EDITION + ": " + d[yAxisMetric];
  });
svg.call(tooltip);

/* OTHER INIT */
initialize();

// set up visualization
function initialize() {
  // initialize click handlers

  // update graph based on which metric they choose
  d3.select("#y-axis-metric")
    .on("change", function() {
      updateYAxisMetric();
      updateVisualization();
    });

  // update the domain based on their chosen time period
  d3.selectAll(".year-selector")
    .on("change", function() {
      updateTimePeriod();
      updateVisualization();
    });

  // Initialize data
  loadData();
}


// Load CSV file
function loadData() {
  d3.csv("data/fifa-world-cup.csv", function(error, csv) {

    csv.forEach(function(d) {
      // store year as an int too
      d.YEAR_INT = +d.YEAR;

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

    // set the time period to be the default (earliest/latest)
    timePeriod = d3.extent(data.map(function(d) {
      return d.YEAR_INT;
    }));

    // Draw the visualization for the first time
    updateVisualization();
  });
}

// Render visualization
function updateVisualization() {

  console.log(data);

  // only include years within the years specified
  var filteredData = data.filter(function(d) {
    return d.YEAR_INT >= timePeriod[0] && d.YEAR_INT <= timePeriod[1];
  });

  // update domains
  // x: years
  x.domain(timePeriod);
  y.domain([0, d3.max(filteredData.map(function(d) {
    return d[yAxisMetric];
  }))]);

  // redraw axes
  xGroup.call(xAxis);
  yGroup.transition()
    .duration(1000)
    .call(yAxis);


  // redraw line
  lineGroup.attr('d', []);


  // redraw circles: enter/update/exit
  // enter
  var circles = circleGroup.selectAll('circle')
    .data(filteredData, function(d) {
        return d.YEAR_INT;
    });
  circles.enter()
    .append('circle')
    .attr('class', 'tooltip-circle')
    .on('mouseover', tooltip.show)
    .on('mouseout', tooltip.hide)
    .on('click', showEdition);

  // remove old ones first; exit
  circles.exit()
    .remove();

  // update
  circles.transition()
    .call(endall, function() {
      lineGroup.attr('d', line(filteredData));
    })
    .duration(1000)
    .attr('r', 5)
    .attr('cx', function(d) {
      return x(d.YEAR_INT);
    })
    .attr('cy', function(d) {
      return y(d[yAxisMetric])
    });
}

// update what's used for the x-asix (goals, attendance, etc)
function updateYAxisMetric() {
  yAxisMetric = d3.select("#y-axis-metric")
    .property("value");
}

// update the time period shown
function updateTimePeriod() {
  timePeriod[0] = parseInt(d3.select("#year-start")
    .property("value"));
  timePeriod[1] = parseInt(d3.select("#year-end")
    .property("value"));
}

// fires `callback` when all transitions are completed.
// http://stackoverflow.com/questions/10692100/invoke-a-callback-at-the-end-of-a-transition#10692220
function endall(transition, callback) {
  if (!callback) callback = function() {};
  if (transition.size() === 0) {
    callback()
  }
  var n = 0;
  transition
    .each(function() {
      ++n;
    })
    .each("end", function() {
      if (!--n) callback.apply(this, arguments);
    });
}


// Show details for a specific FIFA World Cup
function showEdition(d) {
  console.log('clicked', d);

  $('#edition-title')
    .html(d.EDITION);
  $('#edition-winner')
    .html(d.WINNER);
  $('#edition-goals')
    .html(d.GOALS);
  $('#edition-average-goals')
    .html(d.AVERAGE_GOALS);
  $('#edition-matches')
    .html(d.MATCHES);


  $('#edition-teams')
    .html(d.TEAMS);
  $('#edition-average-attendance')
    .html(d.AVERAGE_ATTENDANCE);

  $('#edition-info')
    .removeClass('hidden');
}
