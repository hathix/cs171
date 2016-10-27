// --> CREATE SVG DRAWING AREA
var width = 700;
var height = 500;

var svg = d3.select("#choropleth-holder")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// build map
var projection = d3.geo.equirectangular()
  .scale(width / 2)
  .translate([width / 4, 250]);
var path = d3.geo.path()
  .projection(projection);

// Use the Queue.js library to read two files

var countryDataCSV;
var countryDataById = {};

var choroplethScale = d3.scale.quantize();
var choroplethMetric = null;

// d3 tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip');
svg.call(tip);

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
  // grab metric from page
  var metric = d3.select("#choropleth-metric")
    .node()
    .value;

  // var metric = "UN_Population";
  // grab list of values for metric to calculate domain
  var metricValues = countryDataCSV.map(function(d) {
    return d[metric];
  });

  // update scale
  // colors designed w/ colorbrewer
  choroplethScale.domain(d3.extent(metricValues))
    .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15']);

  // ['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']
  // ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']

  // --> Choropleth implementation
  svg.selectAll(".map")
    .attr("fill", function(d) {
      return calculateFill(d, metric)
    })
    .on('mouseover', function(d) {
        // only show tooltip if we have data for this country
        var countryData = getCountryData(d);
        if (countryData) {
            return tip.show(d);
        }
    })
    .on('mouseout', tip.hide);


    // LEGEND
  // legend adapted from
  // http://stackoverflow.com/questions/21838013/d3-choropleth-map-with-legend
  var legend = svg.selectAll('g.legendEntry')
    .data(choroplethScale.range(), function(d) {
      return d;
    });

  // ENTER
  var legendEnter = legend.enter()
    .append('g')
    .attr('class', 'legendEntry');

  legendEnter
    .append('rect')
    .attr("x", width - 100)
    .attr("y", function(d, i) {
      return i * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("stroke", "black")
    .style("stroke-width", 1);

  legendEnter
    .append('text')
    .attr("x", width - 75)
    .attr("y", function(d, i) {
      return i * 20;
    })
    .attr("dy", "0.8em"); //place text one line *below* the x,y point


  // UPDATE
  legend.selectAll('rect')
    .style("fill", function(d) {
      //the data objects are the fill colors
      return d;
    });

  legend.selectAll('text')
    .text(function(d, i) {
      var extent = choroplethScale.invertExtent(d);
      //extent will be a two-element array, format it however you want:
      var format = d3.format("0.2f");
      return format(+extent[0]) + " - " + format(+extent[1]);
    });


  // EXIT
  legend.exit()
    .remove();


    // TOOLTIP
    tip.html(function(d) {
      // TODO use metric
      var countryData = getCountryData(d);
      if (countryData !== null) {
        return countryData.Country + ": " + countryData[metric];
      } else {
        return null;
      }
    });
}

/*
 * Returns a fill color for a particular country given its GeoJSON object
 * and the metric to consider for it.
 */
function calculateFill(d, metric) {
  var countryData = getCountryData(d);
  if (countryData !== null) {
    var metricValue = countryData[metric];
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

/**
 * Returns country data (from our dataset) given its GeoJSON entry, or null
 * if no data exists.
 */
function getCountryData(geodata) {
  var code = geodata.properties.adm0_a3_is;
  var thisCountryData = countryDataById[code];
  return thisCountryData || null;
}
