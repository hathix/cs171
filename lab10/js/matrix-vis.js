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
    left: 120,
    right: 0,
    top: 100,
    bottom: 0
  };

  this.cellSize = 25;
  this.cellPadding = 6;

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
    .nodeSize([vis.cellSize, vis.cellSize])
    .padding([vis.cellPadding, vis.cellPadding]);

  vis.wrangleData();
};

MatrixVis.prototype.wrangleData = function() {
  var vis = this;

  // merge all datasets into one
  vis.masterData = vis.familyData.map(function(d, i) {
    var marriages = arraySum(vis.marriageData[i]);
    var businessTies = arraySum(vis.businessTieData[i]);
    var relationships = marriages + businessTies;

    return {
      index: i,
      name: d.Family,
      wealth: +d.Wealth,
      priorates: +d.Priorates,
      marriageValues: vis.marriageData[i],
      marriages: marriages,
      businessTieValues: vis.businessTieData[i],
      businessTies: businessTies,
      relationships: relationships
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
    .attr("transform", "translate(" + vis.margins.left + "," + vis.margins.top +
      ")");

  //   group.append("rect").attr("width", vis.innerWidth).attr("height",vis.innerHeight).attr("fill", "red");

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



  // draw labels
  // rows
  var rowLabelGroup = vis.svg.append("g")
    .attr("transform", "translate(" + 0 + "," + vis.margins.top +
      ")");
  var rowLabels = rowLabelGroup.selectAll(".row-family-label")
    .data(vis.masterData);

  rowLabels.enter()
    .append("text")
    .attr("class", "row-family-label");

  rowLabels.attr("x", function(d, i) {
      return 20;
    })
    .attr("y", function(d, i) {
      // Vertically center on squares
      return (i + 1 / 2) * vis.cellSize + (i + 1) * vis.cellPadding;
    })
    .text(function(d, i) {
      return d.name;
    });

  rowLabels.exit()
    .remove();


  // cols
  var colLabelGroup = vis.svg.append("g")
    .attr("transform", "translate(" + vis.margins.left + "," + 0 +
      ")");
  var colLabels = colLabelGroup.selectAll(".col-family-label")
    .data(vis.masterData);

  colLabels.enter()
    .append("text")
    .attr("class", "col-family-label");

  colLabels
    .text(function(d, i) {
      return d.name;
    })
    .attr("transform", function(d, i) {
      var x = (i + 1 / 2) * vis.cellSize + (i + 1) * vis.cellPadding;
      var y = 80;
      return "translate(" + x + "," + y + ")rotate(270)";
    });

  colLabels.exit()
    .remove();

}
