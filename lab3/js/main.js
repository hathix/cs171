// 1.4. Dynamic content
d3.select("body")
  .append("div")
  .text("Dynamic Content");

// 2.1 add new canvas
var svg = d3.select("body")
  .append("svg");
svg.attr('width', 500)
  .attr('height', 500);

// data
var sandwiches = [{
  name: "Thesis",
  price: 7.95,
  size: "large"
}, {
  name: "Dissertation",
  price: 8.95,
  size: "large"
}, {
  name: "Highlander",
  price: 6.50,
  size: "small"
}, {
  name: "Just Tuna",
  price: 6.50,
  size: "small"
}, {
  name: "So-La",
  price: 7.95,
  size: "large"
}, {
  name: "Special",
  price: 12.50,
  size: "small"
}];

/*
[x] Set the x/y coordinates and make sure that the circles don't overlap each other
[x] Radius: large sandwiches should be twice as big as small ones
[x] Colors: use two different circle colors. One color ( fill ) for cheap products < 7.00 USD and one for more expensive products
[ ] Add a border to every circle (SVG property: stroke )
 */
// 2.2-2.3 circles to visualize
var largeRadius = 30;
var smallRadius = 20;
var padding = 8;
var cheapPrice = 7;

svg.selectAll("circle")
  .data(sandwiches)
  .enter()
  .append("circle")
  .attr('cx', function(d, i) {
    return largeRadius * (2 * i + 1) + padding * (2 * i);
  })
  .attr('cy', largeRadius)
  .attr('r', function(d) {
    return d.size == "large" ? largeRadius : smallRadius;
  })
  .attr('fill', function(d) {
    return d.price < cheapPrice ? "green" : "red";
  })
  .attr('stroke', 'black');


// 3.2 city data
d3.csv("data/cities.csv", function(data) {
  console.log("city data", data);

  // 3.3 only look at eu cities
  var euCities = data.filter(function(city) {
    return city.eu === "true";
  });

  // 3.4 write the number of EU cities
  d3.select("body")
    .append("p")
    .text("Number of EU cities: " + euCities.length);

  // 3.5 clean data - convert strings to numbers, if
  euCities.forEach(function(city) {
    city.population = parseInt(city.population);
    city.x = parseInt(city.x);
    city.y = parseInt(city.y);
  });

  // 3.6 draw svg circles for each city
  /*
  All the elements (drawing area + circles) should be added dynamically with D3 SVG container: width = 700px, height = 550px
  Use the x/y coordinates from the dataset to position the circles
   */
  var largeRadius = 8;
  var smallRadius = 4;
  var largePopulation = 1000000;

  var svg = d3.select("body")
    .append("svg");
  svg.attr('width', 700)
    .attr('height', 550)
    .selectAll("circle")
    .data(euCities)
    .enter()
    .append("circle")
    .attr('cx', function(d, i) {
      return d.x;
    })
    .attr('cy', function(d, i) {
      return d.y;
    })
    .attr('r', function(d) {
      return d.population > largePopulation ? largeRadius : smallRadius;
    })
    .attr('fill', 'red')
    .on('click', function(d, i) {
        // write city population to console when clicked
        console.log(d.city, d.population);
    });

  // 3.8 draw labels
  /* Use the SVG text element
All the elements should have the same class: city-label
The labels should be only visible for cities with a population equal or higher than 1.000.000. You can use the SVG property opacity to solve this task.
*/
  var yOffset = 12;
  svg.selectAll('text')
    .data(euCities)
    .enter()
    .append('text')
    .attr('class', 'city-label')
    .attr('x', function(d, i) {
      return d.x;
    })
    .attr('y', function(d, i) {
      return d.y - yOffset;
    })
    .attr('opacity', function(d) {
      // only show labels for large cities
      return d.population > largePopulation ? 1 : 0;
    })
    .text(function(d) {
      return d.city;
    });
});
