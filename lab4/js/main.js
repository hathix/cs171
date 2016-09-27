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
  var dotPadding = 35;

  // linear scales for income and life expectancy
  // income: x axis
  var incomeMax = d3.max(data, function(d) {
    return d.Income;
  });
  var incomeScale = d3.scale.linear()
    .domain([0, incomeMax])
    .range([dotPadding, width - dotPadding]);
  // life expectancy: y axis
  var lifeExpectancyMax = d3.max(data, function(d) {
    return d.LifeExpectancy
  });
  var lifeExpectancyMin = d3.min(data, function(d) {
    return d.LifeExpectancy
  });
  var lifeExpectancyScale = d3.scale.linear()
    .domain([lifeExpectancyMin, lifeExpectancyMax])
    .range([height - dotPadding, dotPadding]);


  // draw svg circles from data points
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return incomeScale(d.Income);
    })
    .attr('cy', function(d) {
        // "coding" y starts from the top, but "graph" y starts from the bottom
      return lifeExpectancyScale(d.LifeExpectancy);
    })
    .attr('r', circleRadius)
    .attr('class', 'country-circle');


  // create axes
  var axisPadding = 20;
  // x: income
  var xAxis = d3.svg.axis()
    .scale(incomeScale)
    .orient('bottom');
  // y: life expectancy
  var yAxis = d3.svg.axis()
    .scale(lifeExpectancyScale)
    .orient('left');
  svg.append('g')
    .attr('class', 'axis')
    .attr("transform", "translate(0," + (height - axisPadding) + ")")
    .call(xAxis);
    svg.append('g')
      .attr('class', 'axis')
      .attr("transform", "translate(" + axisPadding + ", 0)")
      .call(yAxis);


});
