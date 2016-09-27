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

d3.csv("data/refugee.csv", function(data) {


    // clean up loaded information
    // dates are in a format like "2013-01-23"
    var timeFormat = d3.time.format("%Y-%m-%d");
    data.forEach(function(d) {
        d.population = parseInt(d.population);
        d.date = timeFormat.parse(d.date);
    });

    console.log(data);

    // create new svg area
    var svg = d3.select('#area-chart-area')
      .append('svg')
      .attr('width', outerWidth)
      .attr('height', outerHeight);
});
