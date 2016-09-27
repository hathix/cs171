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

    // SCATTER PLOT FOR INCOME AND LIFE EXPECTANCY
    var circleRadius = 8;
    var padding = circleRadius * 2;

  // linear scales for income and life expectancy
  // income: x axis
  var incomeMax = d3.max(data, function(d) {
    return d.Income;
  });
  var incomeScale = d3.scale.linear()
    .domain([0, incomeMax])
    .range([padding , width - padding]);
  // life expectancy: y axis
  var lifeExpectancyMax = d3.max(data, function(d) {
    return d.LifeExpectancy
  });
  var lifeExpectancyScale = d3.scale.linear()
    .domain([0, lifeExpectancyMax])
    .range([padding, height - padding]);

  // draw svg circles from data points
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return incomeScale(d.Income);
    })
    .attr('cy', function(d) {
      return lifeExpectancyScale(d.LifeExpectancy);
    })
    .attr('r', circleRadius)
    .attr('class', 'country-circle');

});
