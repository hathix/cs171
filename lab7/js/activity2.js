var width = 1000;
var height = 600;

// Mercator projection
// var projection = d3.geo.mercator()
//   .translate([width / 2, height / 2])
//   .scale(100)
//   .clipExtent([
//     // clip off of antarctica
//     [0, 0],
//     [width, height * 0.85]
//   ]);

// NEW equirectangular projection
var projection = d3.geo.equirectangular()
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);


var svg = d3.select("#atlas-holder")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Load world atlas
queue()
  .defer(d3.json, "data/world-110m.json")
  .defer(d3.json, "data/airports.json")
  .await(function(error, worldData, airportData) {

    // draw map
    // Convert TopoJSON to GeoJSON (target object = 'countries')
    var geoJSON = topojson.feature(worldData, worldData.objects.countries)
      .features;

    // Render the world atlas by using the path generator
    svg.selectAll("path")
      .data(geoJSON)
      .enter()
      .append("path")
      .attr("class", "map")
      .attr("d", path);


    // draw airports
    svg.selectAll(".airport")
      .data(airportData.nodes)
      .enter()
      .append("circle")
      .attr("class", "airport")
      .attr("transform", function(d) {
        return "translate(" + projection([d.longitude, d.latitude]) + ")"
      })
      .attr("r", 5)
      .append("title")
      .text(function(d) {
        return d.name;
      });

  });
