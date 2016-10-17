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

  // make static title
  d3.select(vis.parentElement)
    .append("h3")
    .text(vis.config.title);


  // Create drawing components
  // variables
  vis.margin = {
    top: 0,
    right: 40,
    bottom: 0,
    left: 100
  };
  vis.outerWidth = 500;
  vis.outerHeight = 150;
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
    .rangeRoundBands([0, vis.height], .2);

  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");
  vis.yAxisGroup = vis.svg.append("g")
    .attr("class", "y-axis axis");

  // bar group
  vis.barGroup = vis.svg.append("g");

  // label group
  vis.labelGroup = vis.svg.append("g");
  vis.labelPadding = {
    top: 20,
    left: 5
  };

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
    .entries(vis.displayData);

  // sort descending
  countPeopleByBucket.sort(function(a, b) {
    return b.values - a.values;
  });

  // Update the visualization
  vis.updateVis(countPeopleByBucket);
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function(visData) {
  var vis = this;

  // (1) Update domains
  vis.x.domain([0, d3.max(visData, function(d) {
    return d.values;
  })]);
  vis.y.domain(visData.map(function(d) {
    return d.key;
  }));

  // (2) Draw rectangles
  var bars = vis.barGroup.selectAll('rect')
    .data(visData, function(d) {
        return d.key;
    });

  // add new stuff
  bars.enter()
    .append('rect')
    .attr('class', 'bar');

  // update existing stuff
  bars
    .transition()
    .duration(1000)
    .attr("x", 0)
    .attr("y", function(d) {
      return vis.y(d.key);
    })
    .attr("width", function(d) {
      return vis.width - vis.x(d.values);
    })
    .attr("height", vis.y.rangeBand());

  // remove old
  bars.exit()
    .transition()
    .duration(1000)
    .remove();


  // (3) Draw labels
  var labels = vis.labelGroup.selectAll('text')
    .data(visData, function(d) {
        return d.key;
    });

  // add new
  labels.enter()
    .append('text')
    .attr('class', 'label');

  // update
  labels.attr("x", function(d) {
      return vis.width - vis.x(d.values) + vis.labelPadding.left;
    })
    .attr("y", function(d) {
      return vis.y(d.key) + vis.labelPadding.top;
    })
    .transition()
    .duration(1000)
    .text(function(d) {
      return d.values;
    });

  // exit
  labels.exit()
    .remove();


  // * TO-DO *


  // Update the y-axis
  vis.svg.select(".y-axis")
  .transition()
  .duration(1000)
    .call(vis.yAxis);
}



/*
 * Filter data when the user changes the selection
 * Example for brushRegion: 07/16/2016 to 07/28/2016
 */

BarChart.prototype.selectionChanged = function(brushRegion) {
  var vis = this;

  // if there's <1 day selected, don't do anything
  if (brushRegion[0].getDate() == brushRegion[1].getDate()) {
      return;
  }

  // Filter data accordingly without changing the original data
  vis.displayData = vis.data.filter(function(d) {
    var date = parseDate(d.survey);
    // date is between start and end
    return date >= brushRegion[0] && date <= brushRegion[1];
  });

  // Update the visualization
  vis.wrangleData();
}
