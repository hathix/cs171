d3.csv("data/buildings.csv", function(data) {
  /* Create a drawing area with at least 500 x 500px
Bind the loaded data to SVG rectangles (and place them correctly)
The bars should be left-aligned
Similar to Lab 3, the different heights are given in pixels, so you don't have to use dynamic scales (data column: height_px )
*/
  console.log(data);

  // 4. create visualization
  var svg = d3.select("#chart-holder")
    .append("svg")
    .attr('width', 500)
    .attr('height', 500);

  // clean data: parse ints
  data.forEach(function(building) {
    building.height_ft = parseInt(building.height_ft);
    building.height_m = parseInt(building.height_m);
    building.height_px = parseInt(building.height_px);
  })

  // sort buildings in decreasing height
  data.sort(function(a, b) {
    return b.height_ft - a.height_ft;
  });

  // load data
  var barSize = 30;
  var padding = 6;
  var barRightShift = 60;
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
    .attr('class', 'building-bar') // TODO add color to class in CSS
    .attr('fill', 'blue');

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
});
