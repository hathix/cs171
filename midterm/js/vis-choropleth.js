// --> CREATE SVG DRAWING AREA
var width = 700;
var height = 500;

var svg = d3.select("#choropleth-holder")
  .append("svg")
  .attr("class", "centered")
  .attr("width", width)
  .attr("height", height);

// build map
var projection = d3.geo.equirectangular()
  .scale(width / 2)
  .translate([width / 4, 250]);
var path = d3.geo.path()
  .projection(projection);

// global data objects to be filled in
var countryDataCSV;
var countryDataById = {};

// public variables and options for the map
var choroplethScale = d3.scale.quantize();
var legendOptions = {
  leftOffset: 120
};

// set up d3 tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip');
svg.call(tip);



// Use the Queue.js library to read two files
queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-water-sanitation-2015.csv")
  .await(function(error, mapTopJson, rawCountryDataCSV) {
    // --> PROCESS DATA
    // clean up raw incoming data
    rawCountryDataCSV.forEach(function(d) {
      d.Improved_Sanitation_2015 = parseFloat(d.Improved_Sanitation_2015);
      d.Improved_Water_2015 = parseFloat(d.Improved_Water_2015);
      d.UN_Population = parseInt(d.UN_Population);
    });
    // we only care about african countries, so filter out everything else
    countryDataCSV = rawCountryDataCSV.filter(function(d) {
      return d.WHO_region === "African";
    });

    // map this to a new data structure where the objects are indexed
    // by country code
    countryDataCSV.forEach(function(d) {
      countryDataById[d.Code] = d;
    });

    // Convert TopoJSON to GeoJSON
    var geoJSON = topojson.feature(mapTopJson, mapTopJson.objects.collection)
      .features;

    // draw shapes on map
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
  // grab metric from page
  var metric = d3.select("#choropleth-metric")
    .node()
    .value;

  // grab data points for metric so we can calculate domain
  var metricValues = countryDataCSV.map(function(d) {
    return d[metric];
  });

  // update scale
  // colors designed w/ ColorBrewer
  // lighter => darker
  choroplethScale
    .domain(d3.extent(metricValues))
    .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15']);

  // --> Choropleth implementation
  // update coloring, no need to redraw actual shapes
  svg.selectAll(".map")
    .attr("fill", function(d) {
      return calculateFill(d, metric);
    })
    .on('mouseover', function(d) {
      // only show tooltip if we have data for this country
      var countryData = getCountryData(d);
      if (countryData) {
        tip.show(d);
      }
    })
    .on('mouseout', tip.hide);


  // LEGEND
  // all legend code below adapted from
  // http://stackoverflow.com/questions/21838013/d3-choropleth-map-with-legend
  var legend = svg.selectAll('g.legendEntry')
    .data(choroplethScale.range(), function(d) {
      // key it to itself
      return d;
    });

  // ENTER
  // because we have a wrapper <g> around all elements, we need another
  // `legendEnter` variable to store it
  var legendEnter = legend.enter()
    .append('g')
    .attr('class', 'legendEntry');

  // draw colored boxes
  legendEnter
    .append('rect')
    .attr("x", width - legendOptions.leftOffset)
    .attr("y", function(d, i) {
      return i * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("stroke", "black")
    .style("stroke-width", 1);

  // draw legend label text
  legendEnter
    .append('text')
    .attr("x", width - legendOptions.leftOffset + 25)
    .attr("y", function(d, i) {
      return i * 20;
    })
    .attr("dy", "0.8em"); //place text one line *below* the x,y point


  // UPDATE
  // update colors
  legend.selectAll('rect')
    .style("fill", function(d) {
      //the data objects are the fill colors
      return d;
    });

  // update labels to show new boundaries of buckets
  legend.selectAll('text')
    .text(function(d, i) {
      var extent = choroplethScale.invertExtent(d);
      // extent will be a two-element array, format it however you want
      // use different formatters for different metrics
      var format;
      switch (metric) {
        case "UN_Population":
          // e.g. "300M" for 300,000,000
          format = d3.format(".2s");
          break;
        case "Improved_Sanitation_2015":
        case "Improved_Water_2015":
        default:
          // e.g. "5.38"
          format = d3.format("0.2f");
          break;
      }

      // label it with the min-to-max range
      return format(+extent[0]) + " - " + format(+extent[1]);
    });

  // EXIT
  legend.exit()
    .remove();


  // TOOLTIP
  tip.html(function(d) {
    // show the country name and the relevant metric
    var countryData = getCountryData(d);
    if (countryData !== null) {
      // data found in our dataset
      var metricData = countryData[metric];

      // format this according to the metric
      var format;
      switch (metric) {
        case "UN_Population":
          format = d3.format("0,000");
          break;
        case "Improved_Sanitation_2015":
        case "Improved_Water_2015":
          format = d3.format("0.1f");
          break;
      }
      var metricString = format(metricData);

      return countryData.Country + ": " + metricString;
    } else {
      // no data, don't show anything in the tooltip
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
      // all good, use the scale to calculate a fill color
      return choroplethScale(metricValue);
    }
  } else {
    // not found in dataset
    return "white";
  }
}

/**
 * Returns country data (from our dataset) given its GeoJSON entry, or null
 * if that country doesnt' exist in our dataset.
 */
function getCountryData(geodata) {
  // use the 3-letter abbreviation
  var code = geodata.properties.adm0_a3_is;
  var thisCountryData = countryDataById[code];
  return thisCountryData || null;
}
