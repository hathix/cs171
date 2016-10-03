// draw refugee data
d3.csv("data/refugee.csv", function(data) {

  // Mike Bostock's margin convention
  var margin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 80
  };

  var outerWidth = 500;
  var outerHeight = 500;
  var innerWidth = outerWidth - margin.left - margin.right;
  var innerHeight = outerHeight - margin.top - margin.bottom;

  // clean up loaded information
  // dates are in a format like "2013-01-23"
  var timeFormat = d3.time.format("%Y-%m-%d");
  data.forEach(function(d) {
    d.population = parseInt(d.population);
    d.date = timeFormat.parse(d.date);
  });

  // data is sorted by date

  console.log(data);

  // create new svg area
  var svg = d3.select('#area-chart-area')
    .append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight);


  // create axis scales
  // x axis: time scales
  // data is sorted by date, so first and last are min and max respectively
  var firstDate = data[0].date;
  var lastDate = data[data.length - 1].date;
  var timeScale = d3.time.scale()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  // y axis: linear scale
  var populationMax = d3.max(data, function(d) {
    return d.population;
  });
  var populationMin = d3.min(data, function(d) {
    return d.population;
  });
  var populationScale = d3.scale.linear()
    .domain([0, populationMax])
    .range([innerHeight, 0]);

  // create area for all internal (non-axis) elements
  var internal = svg.append('g')
    .attr('class', 'internal')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // make area-generating function
  var area = d3.svg.area()
    .x(function(d) {
      // x-value
      return timeScale(d.date);
    })
    .y0(innerHeight) // lower y-value
    .y1(function(d) {
      // upper y-value
      return populationScale(d.population);
    });

  // draw area on a path
  var path = internal.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area);


  // draw axes
  // x: time
  // TODO change
  var xAxis = d3.svg.axis()
    .scale(timeScale)
    .orient('bottom');
  // .ticks(6, d3.format("d"));
  var xGroup = svg.append('g');
  xGroup.attr('class', 'axis')
    .attr("transform", "translate(" + (margin.left) + "," + (innerHeight +
      margin.top) + ")")
    .call(xAxis);

  // add a centered label below the axis
  xGroup.append('text')
    .attr('class', 'axis-label')
    .text('Date')
    .attr('x', (margin.left + innerWidth) / 2)
    .attr('y', margin.bottom * 2 / 3);

  // y: life expectancy
  var yAxis = d3.svg.axis()
    .scale(populationScale)
    .orient('left');
  var yGroup = svg.append('g');
  yGroup.attr('class', 'axis')
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) +
      ")")
    .call(yAxis);

  // add a label left of the axis, rotated so it's parallel with the axis
  var cx = margin.left * -2 / 3;
  var cy = (margin.top + innerHeight) / 2;
  yGroup.append('text')
    .attr('class', 'axis-label')
    .text('Life Expectancy')
    .attr('x', cx)
    .attr('y', cy)
    .attr('transform', 'rotate(-90 ' + cx + ' ' + cy + ')');

  // add chart title
  svg.append('text')
    .attr('class', 'chart-title')
    .text('Camp Population')
    .attr('x', (margin.left + innerWidth) / 2)
    .attr('y', margin.top * 3 / 2);




  // draw line with dynamic tooltip
  // adapted from http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
  var bisectDate = d3.bisector(function(d) {
      return d.date;
    })
    .left;
  // Define the line at the top of the area chart (which we're gonna target)
  var valueLine = d3.svg.line()
    .x(function(d) {
      return timeScale(d.date);
    })
    .y(function(d) {
      return populationScale(d.population);
    });
      // var lineGroup = internal.append("g");
      // lineGroup.append("path")
      //   .attr("class", "line")
      //   .attr("d", valueLine(data));

  // group containing the tooltip itself
  var tooltip = internal.append("g")
    .style("display", "none");


  // add a vertical (x=) line
  tooltip.append("line")
    .attr("class", "x-line")
    .attr("y1", 0)
    .attr("y2", innerHeight);


  // append area to capture mouse
  internal.append("rect")
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function() {
      tooltip.style("display", null);
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    })
    .on("mousemove", mousemove);


  function mousemove() {
    // find the date that the user is on
    var mouseDate = timeScale.invert(d3.mouse(this)[0]);
    // find index of date within array
    var index = bisectDate(data, mouseDate, 1);
    // find the data object (element of the `data` array) that this corresponds to
    // off by one in either direction
    var datumLeft = data[index - 1];
    var datumRight = data[index];
    // choose left or right, whichever we're closer to
    // this is the datum `d` we're showing info about
    var d = mouseDate - datumLeft.date > datumRight.date - mouseDate ?
      datumRight : datumLeft;
    console.log(d);
    // focus.select("text.y1")
    //   .attr("transform",
    //     "translate(" + x(d.date) + "," +
    //     y(d.close) + ")")
    //   .text(d.close);
    // focus.select("text.y2")
    //   .attr("transform",
    //     "translate(" + x(d.date) + "," +
    //     y(d.close) + ")")
    //   .text(d.close);
    // focus.select("text.y3")
    //   .attr("transform",
    //     "translate(" + x(d.date) + "," +
    //     y(d.close) + ")")
    //   .text(formatDate(d.date));
    // focus.select("text.y4")
    //   .attr("transform",
    //     "translate(" + x(d.date) + "," +
    //     y(d.close) + ")")
    //   .text(formatDate(d.date));
    tooltip.select(".x-line")
      .attr("transform",
        "translate(" + timeScale(d.date) + ",0)");
    //   .attr("y2", innerHeight - populationScale(d.population));
    // focus.select(".y")
    //   .attr("transform",
    //     "translate(" + width * -1 + "," +
    //     y(d.close) + ")")
    //   .attr("x2", width + width);
  }

});

/* CAMP SHELTERS */
// camp shelter data
var shelterData = [{
  type: "Caravan",
  percent: .7968
}, {
  type: "Tent + Caravan",
  percent: .1081
}, {
  type: "Tent",
  percent: .0951
}];

// Mike Bostock's margin convention
var margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 60
};

var outerWidth = 500;
var outerHeight = 500;
var innerWidth = outerWidth - margin.left - margin.right;
var innerHeight = outerHeight - margin.top - margin.bottom;

var svg = d3.select('#bar-chart-area')
  .append('svg')
  .attr('width', outerWidth)
  .attr('height', outerHeight);


// create axis scales
// // x axis: time scales
// // data is sorted by date, so first and last are min and max respectively
// var firstDate = data[0].date;
// var lastDate = data[data.length - 1].date;
// var timeScale = d3.time.scale()
//   .domain([firstDate, lastDate])
//   .range([0, innerWidth]);

// y axis: linear scale
// these are percentages that run rather large, so we can go all the way
// to 100%
var percentScale = d3.scale.linear()
  .domain([0, 1])
  .range([innerHeight, 0]);

// draw bars
// useful constants
// var numBars = shelterData.length;
var barPadding = 0.1;
var barOuterPadding = 0.1;
// var barSize = (innerWidth - (barPadding * (numBars + 1))) / numBars;

var chartGroup = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


var typeScale = d3.scale.ordinal()
  .domain(shelterData.map(function(d) {
    return d.type
  }))
  .rangeRoundBands(
    [0, innerWidth],
    barPadding,
    barOuterPadding
  );

// draw bars
chartGroup.selectAll("rect")
  .data(shelterData)
  .enter()
  .append("rect")
  .attr('x', function(d, i) {
    return typeScale(d.type);
  })
  .attr('y', function(d, i) {
    return percentScale(d.percent);
  })
  .attr('width', function(d) {
    return typeScale.rangeBand()
  })
  .attr('height', function(d) {
    // build the bar up
    return innerHeight - percentScale(d.percent);
  })
  .attr('class', 'bar');

// draw labels
var labelPadding = innerHeight * 0.03;
chartGroup.selectAll(".bar-label")
  .data(shelterData)
  .enter()
  .append("text")
  .attr('x', function(d, i) {
    // center over bar
    return typeScale(d.type) + typeScale.rangeBand() / 2;
  })
  .attr('y', function(d, i) {
    // move it a little up
    return percentScale(d.percent) - labelPadding;
  })
  .text(function(d) {
    return d3.format(".2%")(d.percent);
  })
  .attr('class', 'bar-label');

var xAxis = d3.svg.axis()
  .scale(typeScale)
  .orient('bottom');

var xGroup = svg.append('g');
xGroup.attr('class', 'axis')
  .attr("transform", "translate(" + (margin.left) + "," + (innerHeight +
    margin.top) + ")")
  .call(xAxis);

// add a centered label below the axis
xGroup.append('text')
  .attr('class', 'axis-label')
  .text('Type of Shelter')
  .attr('x', (margin.left + innerWidth) / 2)
  .attr('y', margin.bottom * 2 / 3);

// y: life expectancy
var yAxis = d3.svg.axis()
  .scale(percentScale)
  .orient('left')
  .tickFormat(d3.format(".0%"));

var yGroup = svg.append('g');
yGroup.attr('class', 'axis')
  .attr("transform", "translate(" + (margin.left) + "," + (margin.top) +
    ")")
  .call(yAxis);

// add a label left of the axis, rotated so it's parallel with the axis
var cx = margin.left * -2 / 3;
var cy = (margin.top + innerHeight) / 2;
yGroup.append('text')
  .attr('class', 'axis-label')
  .text('Percent')
  .attr('x', cx)
  .attr('y', cy)
  .attr('transform', 'rotate(-90 ' + cx + ' ' + cy + ')');

// add chart title
svg.append('text')
  .attr('class', 'chart-title')
  .text('Camp Population')
  .attr('x', (margin.left + innerWidth) / 2)
  .attr('y', margin.top * 3 / 2);
