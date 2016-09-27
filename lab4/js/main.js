// Mike Bostock's margin convention
var margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 60
};

// SVG Size
var width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  // SCATTER PLOT FOR INCOME AND LIFE EXPECTANCY

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
  var lifeExpectancyMin = d3.min(data, function(d) {
    return d.LifeExpectancy
  });
  // add a buffer to prevent elements from hitting the x axis
  var lifeExpectancyBuffer = 5;
  var lifeExpectancyScale = d3.scale.linear()
    .domain([
      lifeExpectancyMin - lifeExpectancyBuffer,
      lifeExpectancyMax + lifeExpectancyBuffer
    ])
    .range([height, 0]);


  // make linear population-dependent radius scale
  var populationMax = d3.max(data, function(d) {
    return d.Population
  });
  var populationScale = d3.scale.linear()
    .domain([0, populationMax])
    .range([4, 30]);

  // draw svg circles from data points
  var circleGroup = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  circleGroup.selectAll('circle')
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
    .attr('r', function(d) {
        return populationScale(d.Population);
    })
    .attr('class', 'country-circle');


  // create axes
  // var axisPadding = 20;
  // x: income
  var xAxis = d3.svg.axis()
    .scale(incomeScale)
    .orient('bottom');
  var xGroup = svg.append('g');
  xGroup.attr('class', 'axis')
    .attr("transform", "translate(" + (margin.left) + "," + (height +
      margin.top) + ")")
    .call(xAxis);

  // add a centered label below the axis
  xGroup.append('text')
    .attr('class', 'axis-label')
    .text('Income')
    .attr('x', (margin.left + width) / 2)
    .attr('y', margin.bottom * 2 / 3);

  // y: life expectancy
  var yAxis = d3.svg.axis()
    .scale(lifeExpectancyScale)
    .orient('left');
  var yGroup = svg.append('g');
  yGroup.attr('class', 'axis')
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) +
      ")")
    .call(yAxis);

  // add a label left of the axis, rotated so it's parallel with the axis
  var cx = margin.left * -2 / 3;
  var cy = (margin.top + height) / 2;
  yGroup.append('text')
    .attr('class', 'axis-label')
    .text('Life Expectancy')
    .attr('x', cx)
    .attr('y', cy)
    .attr('transform', 'rotate(-90 ' + cx + ' ' + cy + ')');


});
