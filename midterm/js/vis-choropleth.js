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

var countryDataCSV;
var countryDataById = {};

var choroplethScale = d3.scale.quantize();
var choroplethMetric = null;

queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-water-sanitation-2015.csv")
  .await(function(error, mapTopJson, rawCountryDataCSV) {
    // --> PROCESS DATA
    // clean this up
    rawCountryDataCSV.forEach(function(d) {
      d.Improved_Sanitation_2015 = parseFloat(d.Improved_Sanitation_2015);
      d.Improved_Water_2015 = parseFloat(d.Improved_Water_2015);
      d.UN_Population = parseInt(d.UN_Population);
    });
    // and we only care about african countries
    countryDataCSV = rawCountryDataCSV.filter(function(d) {
      return d.WHO_region == "African";
    });

    // map this data so it's indexed by country code
    countryDataCSV.forEach(function(d) {
      countryDataById[d.Code] = d;
    });
    console.log(countryDataById);

    // Convert TopoJSON to GeoJSON
    var geoJSON = topojson.feature(mapTopJson, mapTopJson.objects.collection)
      .features;
    svg.selectAll("path")
      .data(geoJSON)
      .enter()
      .append("path")
      .attr("class", "map")
      .attr("d", path)

    // Update choropleth
    updateChoropleth();
  });

/*
    Updates the choropleth's metric.
    "UN population", "Improved drinking-water sources (% of population)", "Improved sanitation facilities (% of population)".
 */
// function setMetric(metric) {
//     // update variable here
//     choroplethMetric = metric;
//
//     // update scale
//
// }

function updateChoropleth() {
  var metric = "UN_Population";
  // grab list of values for metric to calculate domain
  var metricValues = countryDataCSV.map(function(d) {
    return d[metric];
  });

  // update scale
  // colors designed w/ colorbrewer
  choroplethScale.domain(d3.extent(metricValues))
    .range(['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']);

    // ['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']
    // ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']

  // --> Choropleth implementation
  svg.selectAll(".map")
    .attr("fill", function(d) { return calculateFill(d, metric) });
}

/*
 * Returns a fill color for a particular country given its GeoJSON object
 * and the metric to consider for it.
 */
function calculateFill(d, metric) {
  var code = d.properties.adm0_a3_is;
  var thisCountryData = countryDataById[code];

  if (thisCountryData) {
    var metricValue = thisCountryData[metric];
    if (isNaN(metricValue)) {
      // invalid data
      return "white";
    } else {
      // all good
      return choroplethScale(metricValue);
    }
  } else {
    return "white";
  }
}
