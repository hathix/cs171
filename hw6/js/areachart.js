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
  vis.svg = d3.select(vis.parentElement)
    .append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
      ")");

  // Scales and axes
  vis.x = d3.time.scale()
    .range([0, vis.width]);
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


  // area layout
  vis.area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) {
      return vis.x(d.date);
    })
    .y0(function(d) {
      return vis.height;
    })
    .y1(function(d) {
      return vis.y(d.values);
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

  var countSurveysByDate = d3.nest()
    .key(function(d) {
      return d.survey;
    })
    .rollup(function(leaves) {
      return leaves.length;
    })
    .entries(vis.data);

  // the key must be a string, so let's add our own date field
  // that caches the parsing
  countSurveysByDate.forEach(function(d) {
    d.date = parseDate(d.key);
  })

  // (2) Sort data by day
  countSurveysByDate.sort(function(a, b) {
    return a.date - b.date;
  });
  console.log(countSurveysByDate);
  vis.displayData = countSurveysByDate;


  // Update the visualization
  vis.updateVis();
}


/*
 * The drawing function
 */

AreaChart.prototype.updateVis = function() {
  var vis = this;

  // update domains
  vis.x.domain(d3.extent(vis.displayData, function(d) {
    return d.date;
  }));
  vis.y.domain([0, d3.max(vis.displayData, function(d) {
    return d.values;
  })]);

  // enter/update/exit the area
  var areaPath = vis.svg.selectAll(".area")
    .data(vis.displayData);

  areaPath.enter()
    .append("path")
    .datum(vis.displayData)
    .attr("class", "area")

  areaPath
    .attr("d", vis.area);

  // TO-DO: Update tooltip text


  areaPath.exit()
    .remove();


  // Update the axes
  vis.svg.select(".x-axis")
    .call(vis.xAxis);
  vis.svg.select(".y-axis")
    .call(vis.yAxis);
};
