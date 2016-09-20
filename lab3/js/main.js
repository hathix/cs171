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
[ ] Set the x/y coordinates and make sure that the circles don't overlap each other
[ ] Radius: large sandwiches should be twice as big as small ones
[ ] Colors: use two different circle colors. One color ( fill ) for cheap products < 7.00 USD and one for more expensive products
[ ] Add a border to every circle (SVG property: stroke )
 */
// 2.2-2.3 circles to visualize
var largeRadius = 30;
var smallRadius = 20;
var padding = 8;
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
  });
