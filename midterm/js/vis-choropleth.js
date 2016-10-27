// --> CREATE SVG DRAWING AREA
var width = 600;
var height = 600;

var svg = d3.select("#choropleth-holder")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// build map
var projection = d3.geo.equirectangular()
    .scale(width / 2)
  .translate([width / 3, height / 3]);
var path = d3.geo.path()
  .projection(projection);

// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-water-sanitation-2015.csv")
  .await(function(error, mapTopJson, countryDataCSV) {

    // --> PROCESS DATA

    console.log(mapTopJson);
    // draw map
    // Convert TopoJSON to GeoJSON
    var geoJSON = topojson.feature(mapTopJson, mapTopJson.objects.collection)
      .features;
    svg.selectAll("path")
      .data(geoJSON)
      .enter()
      .append("path")
      .attr("class", "map")
      .attr("d", path);


    // Update choropleth
    updateChoropleth();
  });


function updateChoropleth() {

  // --> Choropleth implementation

}
