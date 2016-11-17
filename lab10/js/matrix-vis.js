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

  this.outerWidth = 700;
  this.outerHeight = 700;

  this.margins = {
    left: 100,
    right: 0,
    top: 100,
    bottom: 0
  };

  this.innerWidth = this.outerWidth - this.margins.left - this.margins.right;
  this.innerHeight = this.outerHeight - this.margins.top - this.margins.bottom;

  this.initVis();
}

MatrixVis.prototype.initVis = function() {
  var vis = this;

  // initialize svg
  vis.svg = d3.select('#' + vis.parentElement)
    .append("svg")
    .attr('width', vis.innerWidth)
    .attr('height', vis.innerHeight);

  // initialize grid
  var rows = vis.marriageData.length;
  var cols = vis.marriageData[0].length;
  vis.grid = d3.layout.grid()
    .bands()
    .rows(rows)
    .cols(cols)
    .nodeSize([25, 25])
    .padding([6, 6]);

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

  // draw a square made of 2 triangles for each
  // each triangle represents marriage and business tie data
  var squares = vis.svg.selectAll(".square")
    .data(vis.grid(vis.displayData));

  // var squares = vis.svg.selectAll("square")

  var group = squares.enter()
    .append("g")
    .attr("class", "square")
    .attr("transform", "translate(" + vis.margins.top + "," + vis.margins.left + ")");

  var upperTriangles = group.append("path")
    .attr("class", "triangle-path")
    .attr("fill", function(d) {
      // purple if married
      return d.marriage ? "purple" : null;
    })
    .attr("d", function(d, i) {
      var cellWidth = vis.grid.nodeSize()[0];
      var cellHeight = vis.grid.nodeSize()[1];
      var x = d.x;
      var y = d.y;

      return 'M ' + x + ' ' + y + ' l ' + cellWidth + ' 0 l 0 ' +
        cellHeight + ' z';
    });

  var lowerTriangles = group.append("path")
    .attr("class", "triangle-path")
    .attr("fill", function(d) {
      // orange if business tied
      return d.businessTie ? "orange" : null;
    })
    .attr("d", function(d, i) {
      var cellWidth = vis.grid.nodeSize()[0];
      var cellHeight = vis.grid.nodeSize()[1];
      var x = d.x;
      var y = d.y;

      return 'M ' + x + ' ' + y + ' l 0 ' + cellHeight + ' l ' +
        cellWidth + ' 0 z';
    });

  // .attr("class", "square")
  // .attr("width", vis.grid.nodeSize()[0])
  // .attr("height", vis.grid.nodeSize()[1])
  // .attr("transform", function(d) {
  //   return "translate(" + d.x + "," + d.y + ")";
  // });

  squares.exit()
    .remove();
}
