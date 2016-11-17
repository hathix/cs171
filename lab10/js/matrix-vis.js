/**
 * A matrix visualizer.
 * @param {String} _parentElement   The id of the element to put the visualization in, without the "#"."
 */
MatrixVis = function(_parentElement, _familyData, _marriageData,
  _businessTieData) {
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
      wealth: +d.Wealth,
      priorates: +d.Priorates,
      marriageValues: vis.marriageData[i],
      businessTieValues: vis.businessTieData[i]
    };
  });

  console.log(vis.masterData);

  // we need to convert all this into a 2D array of objects
  // { marriage: 0/1, businessTie: 0/1 }
  var data2D = vis.masterData.map(function(d) {
    // return an array
    // combine the marriageValues and businessTie values - zip each corresponding
    // element into an object
    var list = [];
    for (var i = 0; i < d.marriageValues.length; i++) {
      list[i] = {
        marriage: d.marriageValues[i],
        businessTie: d.businessTieValues[i]
      };
    }
    return list;
  });

  // now flatten into 1D
  vis.displayData = [].concat.apply([], data2D);

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
