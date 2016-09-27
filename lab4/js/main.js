// SVG Size
var width = 700,
  height = 500;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data) {
  // // Analyze the dataset in the web console
  // console.log(data);
  // console.log("Countries: " + data.length);

  // clean up data
  data.forEach(function(country) {
    country.Income = parseInt(country.Income);
    country.LifeExpectancy = parseFloat(country.LifeExpectancy);
    country.Population = parseInt(country.Population);
  });

  console.log(data);

  // create new svg area
  var svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // linear scales for income and life expectancy
  // income: x axis
  var incomeMax = d3.max(data, function(d) {
    return d.Income;
  });
  var incomeScale = d3.scale.linear()
    .domain([0, incomeMax])
    .range([0, width]);
// life expectancy: y axis
  var lifeExpectancyMax = d3.max(data, function(d) {
    return d.LifeExpectancy
  });
  var lifeExpectancyScale = d3.scale.linear()
    .domain([0, lifeExpectancyMax])
    .range([0, height]);

    // draw svg circles from data points
    svg.select('circle').data(data).enter().append('circle').attr('x', function(d) {
        return incomeScale(d.Income);
    }).attr('y', function(d) {
        return incomeScale(d.LifeExpectancy);
    }).attr('r', 10).attr('fill', 'steelblue');

});
