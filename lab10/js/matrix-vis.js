/**
 * A matrix visualizer.
 * @param {String} _parentElement   The id of the element to put the visualization in, without the "#"."
 * @param {Object[][]} _data A 2-dimensional matrix of objects to be visualized. Each one should have:
 *                              - int marriage (0 or 1)
 */
MatrixVis = function(_parentElement, _data) {
  this.data = _data;
  this.parentElement = _parentElement;

  this.outerWidth = 500;
  this.outerHeight = 500;

  this.initVis();
}

MatrixVis.prototype.initVis = function() {
  var vis = this;

  // initialize svg
  vis.svg = d3.select('#' + vis.parentElement)
    .append("svg")
    .attr('width', vis.outerWidth)
    .attr('height', vis.outerHeight);

  // initialize grid
  var rows = vis.data.length;
  var cols = vis.data[0].length;
  vis.grid = d3.layout.grid()
    .bands()
    .rows(rows)
    .cols(cols)
    .size([vis.outerWidth, vis.outerHeight])
    .padding([0.2, 0.2]);
  console.log(window.zzz = vis.grid);

  vis.wrangleData();
};

MatrixVis.prototype.wrangleData = function() {
  var vis = this;

  // convert raw 2D data into a 1D array, to be shown to the user
  vis.displayData = [].concat.apply([], vis.data);

  vis.updateVis();
};

MatrixVis.prototype.updateVis = function() {
  var vis = this;

  // draw grid squares
  var squares = vis.svg.selectAll(".square")
    .data(vis.grid(vis.displayData));

  console.log(vis.grid(vis.displayData));

  squares.enter()
    .append("rect")
    .attr("class", "square")
    .attr("width", vis.grid.nodeSize()[0])
    .attr("height", vis.grid.nodeSize()[1])
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
}
