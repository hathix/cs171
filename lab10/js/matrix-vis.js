/**
 * A matrix visualizer.
 * @param {String} _parentElement   The id of the element to put the visualization in, without the "#"."
 */
MatrixVis = function(_parentElement, _familyData, _marriageData, _businessTieData) {
  this.parentElement = _parentElement;
  this.familyData = _familyData;
  this.marriageData = _marriageData;
  this.businessTieData = _businessTieData;

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
  var rows = vis.marriageData.length;
  var cols = vis.marriageData[0].length;
  vis.grid = d3.layout.grid()
    .bands()
    .rows(rows)
    .cols(cols)
    .size([vis.outerWidth, vis.outerHeight])
    .padding([0.2, 0.2]);

  vis.wrangleData();
};

MatrixVis.prototype.wrangleData = function() {
  var vis = this;

  // merge all datasets into one
  vis.masterData = vis.familyData.map(function(d, i) {
      return {
          index: i,
          name: d.Family,
          wealth: d.Wealth,
          priorates: d.Priorates,
          marriageValues: vis.marriageData[i],
          businessTieValues: vis.businessTieData[i]
      };
  });

  console.log(vis.masterData);

  // convert raw 2D data into a 1D array, to be shown to the user
  // vis.displayData = [].concat.apply([], vis.data);

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

  square.exit()
    .remove();
}
