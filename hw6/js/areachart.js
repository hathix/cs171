/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */

AreaChart = function(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.displayData = [];

  this.initVis();
}


/*
 * Initialize visualization (static content; e.g. SVG area, axes, brush component)
 */

AreaChart.prototype.initVis = function() {
  var vis = this;

  // * TO-DO *
  vis.margin = {
    top: 40,
    right: 0,
    bottom: 60,
    left: 60
  };
  vis.outerWidth = 500;
  vis.outerHeight = 500;
  vis.width = vis.outerWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.outerHeight - vis.margin.top - vis.margin.bottom;


  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement)
    .append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
      ")");

  // TO-DO: Overlay with path clipping
  vis.svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", vis.width)
    .attr("height", vis.height);

  // Scales and axes
  vis.x = d3.time.scale()
    .range([0, vis.width])
    .domain(d3.extent(vis.data, function(d) {
      return d.Year;
    }));

  vis.y = d3.scale.linear()
    .range([vis.height, 0]);

  vis.xAxis = d3.svg.axis()
    .scale(vis.x)
    .orient("bottom");

  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");

  vis.svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + vis.height + ")");

  vis.svg.append("g")
    .attr("class", "y-axis axis");


  // Initialize stack layout
  // get all categories
  var dataCategories = colorScale.domain();
  // Rearrange data into layers
  var transposedData = dataCategories.map(function(name) {
    return {
      name: name,
      values: vis.data.map(function(d) {
        return {
          Year: d.Year,
          y: d[name]
        };
      })
    };
  });

  // Initialize layout function
  // with the 'values' accessor due to the multi-dimensional array
  var stack = d3.layout.stack()
    .values(function(d) {
      return d.values;
    });
  vis.stackedData = stack(transposedData);


  // Stacked area layout
  vis.area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) {
      return vis.x(d.Year);
    })
    .y0(function(d) {
      return vis.y(d.y0);
    })
    .y1(function(d) {
      return vis.y(d.y0 + d.y);
    });


  // (Filter, aggregate, modify data)
  vis.wrangleData();
}


/*
 * Data wrangling
 */

AreaChart.prototype.wrangleData = function() {
  var vis = this;

  // (1) Group data by date and count survey results for each day
  // (2) Sort data by day


  // * TO-DO *


  // Update the visualization
  vis.updateVis();
}


/*
 * The drawing function
 */

AreaChart.prototype.updateVis = function() {
  var vis = this;

  // * TO-DO *

}
