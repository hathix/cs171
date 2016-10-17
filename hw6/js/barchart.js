/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 *                       			   `key`, `title`
 */

BarChart = function(_parentElement, _data, _config) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.config = _config;
  this.displayData = _data;

  this.initVis();
}



/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BarChart.prototype.initVis = function() {
  var vis = this;

  // * TO-DO *


  // (Filter, aggregate, modify data)
  vis.wrangleData();
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function() {
  var vis = this;

  // calculations
  // (1) Group data by key variable (e.g. 'electricity') and count leaves
  // (2) Sort columsn descending
  // * TO-DO *
  // count people in each bucket
  var countPeopleByBucket = d3.nest()
    .key(function(d) {
      return d[vis.config.key]
    })
    .rollup(function(leaves) {
      return leaves.length;
    })
    .entries(vis.data);

  // sort descending
  countPeopleByBucket.sort(function(a, b) {
    return b.values - a.values;
  });
  this.displayData = countPeopleByBucket;
  console.log(countPeopleByBucket);

  // Create drawin components
  // variables
  vis.margin = {
    top: 20,
    right: 0,
    bottom: 30,
    left: 60
  };
  vis.outerWidth = 500;
  vis.outerHeight = 200;

  vis.width = vis.outerWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.outerHeight - vis.margin.top - vis.margin.bottom;

  // Draw SVG
  vis.svg = d3.select(vis.parentElement)
    .append("svg")
    .attr("width", vis.outerWidth)
    .attr("height", vis.outerHeight)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
      ")");

  // Scales and axes
  vis.x = d3.scale.linear()
    .range([vis.width, 0]);
  vis.y = d3.scale.ordinal()
    .rangeRoundBands([0, vis.height], .1);

  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");
  vis.yAxisGroup = vis.svg.append("g")
    .attr("class", "y-axis axis");

  // bar group
  vis.barGroup = vis.svg.append("g");


  // Update the visualization
  vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function() {
  var vis = this;

  // (1) Update domains
  vis.x.domain([0, d3.max(vis.displayData, function(d) {
    return d.values;
  })]);
  vis.y.domain(vis.displayData.map(function(d) {
    return d.key;
  }));

  // (2) Draw rectangles
  var bars = vis.barGroup.selectAll('rect')
    .data(vis.displayData);

  // add new stuff
  bars.enter()
    .append('rect')
    .attr('class', 'bar');

  // update existing stuff
  bars
  // .transition()
  // .duration(1000)
    .attr("x", function(d) {
      return vis.x(d.values);
    })
    .attr("y", function(d) {
      return vis.y(d.key);
    })
    .attr("width", function(d) {
      return vis.width - vis.y(d.key);
    })
    .attr("height", vis.y.rangeBand());

  bars.exit()
    // .transition()
    // .duration(1000)
    .remove();


  // (3) Draw labels


  // * TO-DO *


  // Update the y-axis
  vis.svg.select(".y-axis")
    .call(vis.yAxis);
}



/*
 * Filter data when the user changes the selection
 * Example for brushRegion: 07/16/2016 to 07/28/2016
 */

BarChart.prototype.selectionChanged = function(brushRegion) {
  var vis = this;

  // Filter data accordingly without changing the original data


  // * TO-DO *


  // Update the visualization
  vis.wrangleData();
}
