
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


// 1) INITIALIZE FORCE-LAYOUT


// Load data
d3.json("data/airports.json", function(data) {

  // 2a) DEFINE 'NODES' AND 'EDGES'
  // 2b) START RUNNING THE SIMULATION

  // 3) DRAW THE LINKS (SVG LINE)

  // 4) DRAW THE NODES (SVG CIRCLE)

  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS

});