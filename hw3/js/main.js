d3.csv("data/buildings.csv", function(data) {
  /* Create a drawing area with at least 500 x 500px
Bind the loaded data to SVG rectangles (and place them correctly)
The bars should be left-aligned
Similar to Lab 3, the different heights are given in pixels, so you don't have to use dynamic scales (data column: height_px )
*/
  console.log(data);
  // clean data: parse ints
  data.forEach(function(building) {
    building.height_ft = parseInt(building.height_ft);
    building.height_m = parseInt(building.height_m);
    building.height_px = parseInt(building.height_px);
    building.floors = parseInt(building.floors);
  });

  // sort buildings in decreasing height
  data.sort(function(a, b) {
    return b.height_ft - a.height_ft;
  });


  // 4. create visualization
  var svg = d3.select("#chart-holder")
    .append("svg")
    .attr('width', 500)
    .attr('height', 500);


  // load data
  var barSize = 30;
  var padding = 6;
  var barRightShift = 210;
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr('x', barRightShift)
    .attr('y', function(d, i) {
      return (barSize + padding) * i;
    })
    .attr('width', function(d) {
      return d.height_px;
    })
    .attr('height', function(d) {
      return barSize;
    })
    .attr('class', 'building-bar')
    .on('click', function(d, i) {
      updateBuildingPreview(d);
    });

  // add height label
  svg.selectAll("text.label-height")
    .data(data)
    .enter()
    .append("text")
    .attr('class', 'label-height')
    .attr('x', function(d) {
      return barRightShift + d.height_px;
    })
    .attr('y', function(d, i) {
      return (barSize + padding) * i + barSize / 2;
    })
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
      return barRightShift;
    })
    .attr('y', function(d, i) {
      return (barSize + padding) * i + barSize / 2;
    })
    .text(function(d) {
      return d.building;
    })
    .on('click', function(d, i) {
      updateBuildingPreview(d);
    });


});

function updateBuildingPreview(data) {

    // Bonus: Wikipedia link
    // e.g. https://en.wikipedia.org/wiki/Issaquah,_Washington
    // replace spaces with underscores
    var slug = data.building.replace(/ /g, '_');
    // build url
    var wikipediaURL = "https://en.wikipedia.org/wiki/" + slug;

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
    $('#building-wikipedia-url').attr('href', wikipediaURL);
}
