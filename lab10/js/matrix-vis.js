/**
 * A matrix visualizer.
 * @param {String} _parentElement   The id of the element to put the visualization in, without the "#"."
 * @param {Object[][]} _data A 2-dimensional matrix of ints to be visualized.
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
    .rows(rows)
    .cols(cols)
    .nodeSize([50, 50])
    .padding([10, 10]);

  vis.wrangleData();
};

MatrixVis.prototype.wrangleData = function() {
  var vis = this;

  // convert raw 2D data into a 1D array, to be shown to the user
  vis.displayData = [].concat.apply([], vis.data);

  vis.updateVis();
};

MatrixVis.prototype.updateVis = function() {
  // draw grid
  // var nodes = svg
}
