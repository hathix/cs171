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
    d3.select("body").append("p").text("Number of EU cities: " + euCities.length);
});
