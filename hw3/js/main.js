// load building data
d3.csv("data/buildings.csv", function(data) {
  console.log(data);

  // clean data: parse numbers from strings to integers
  data.forEach(function(building) {
    building.height_ft = parseInt(building.height_ft);
    building.height_m = parseInt(building.height_m);
    building.height_px = parseInt(building.height_px);
    building.floors = parseInt(building.floors);
  });

  // sort buildings by decreasing height
  data.sort(function(a, b) {
    return b.height_ft - a.height_ft;
  });

  // 4. create visualization chart area
  var svg = d3.select("#chart-holder")
    .append("svg")
    .attr('width', 500)
    .attr('height', 500);

  // load data into graph
  // useful constants
  var barSize = 40;
  var barPadding = 6;
  var barRightShift = 225;
  // draw bars
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr('x', barRightShift)
    .attr('y', function(d, i) {
      return (barSize + barPadding) * i;
    })
    .attr('width', function(d) {
      return d.height_px;
    })
    .attr('height', barSize)
    .attr('class', 'building-bar')
    .on('click', function(d, i) {
      updateBuildingPreview(d);
    });

  // add labels
  var textLeftPadding = 6;
  var textRightPadding = 6;
  var textTopPadding = 4.5;
  // a function to calculate the y-location of a text label. Designed to be
  // used as a click handler.
  var calculateYLocation = function(d, i) {
    return (barSize + barPadding) * i + barSize / 2 + textTopPadding;
  };

  // add height labels
  svg.selectAll("text.label-height")
    .data(data)
    .enter()
    .append("text")
    .attr('class', 'label-height')
    .attr('x', function(d) {
      return barRightShift + d.height_px - textLeftPadding;
    })
    .attr('y', calculateYLocation)
    .text(function(d) {
      return d.height_ft
    });

  // add building name labels
  svg.selectAll("text.label-name")
    .data(data)
    .enter()
    .append("text")
    .attr('class', 'label-name')
    .attr('x', function(d) {
      return barRightShift - textRightPadding;
    })
    .attr('y', calculateYLocation)
    .text(function(d) {
      return d.building;
    })
    .on('click', function(d, i) {
      updateBuildingPreview(d);
    });
});

/**
 * Displays the given building's height, location, etc.
 * in the infobox on the side of the graph.
 */
function updateBuildingPreview(data) {
  // make infobox visible
  $('#infobox')
    .css('display', 'block');

  // Bonus: Wikipedia link
  // e.g. https://en.wikipedia.org/wiki/Issaquah,_Washington
  // replace spaces with underscores
  var slug = data.building.replace(/ /g, '_');
  // build url
  var wikipediaURL = "https://en.wikipedia.org/wiki/" + slug;

  // fill in all the info we have
  $('#building-name')
    .html(data.building);
  $('#building-height')
    .html(data.height_ft);
  $('#building-floors')
    .html(data.floors);
  $('#building-location')
    .html(data.city + ", " + data.country);
  $('#building-completed')
    .html(data.completed);
  $('#building-image')
    .attr('src', "data/img/" + data.image);
  $('#building-wikipedia-url')
    .attr('href', wikipediaURL);
}
