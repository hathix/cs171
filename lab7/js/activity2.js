var width = 1000;
var height = 600;

var projection = d3.geo.mercator()
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

// Load world atlas
d3.json("data/world-110m.json", function(error, data) {

  // Convert TopoJSON to GeoJSON (target object = 'countries')
  var geoJSON = topojson.feature(data, data.objects.countries)
    .features;

  // Render the world atlas by using the path generator
  svg.selectAll("path")
    .data(geoJSON)
    .enter()
    .append("path")
    .attr("d", path);
});
