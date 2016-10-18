var width = 400,
  height = 400;

var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


// 1) INITIALIZE FORCE-LAYOUT
var force = d3.layout.force()
  .size([width, height]);


// Load data
d3.json("data/airports.json", function(data) {

  console.log(data);

  // 2a) DEFINE 'NODES' AND 'EDGES'
  force.nodes(data.nodes)
    .links(data.links);

  // 2b) START RUNNING THE SIMULATION
  force.start();

  // 3) DRAW THE LINKS (SVG LINE)
  var edge = svg.selectAll(".edge")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "edge")
    .attr("stroke", "green");

  // 4) DRAW THE NODES (SVG CIRCLE)
  // Draw nodes
  var node = svg.selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .attr("fill", "green");

  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
  force.on("tick", function() {

    // Update node coordinates
    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });

    // Update edge coordinates
    edge.attr("x1", function(d) {
        return d.source.x;
    }).attr("x2", function(d) {
        return d.target.x;
    }).attr("y1", function(d) {
        return d.source.y;
    }).attr("y2", function(d) {
        return d.target.y;
    })
  });
});
