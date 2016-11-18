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
    .attr('width', vis.outerWidth)
    .attr('height', vis.outerHeight);

  // initialize grid
  var rows = vis.marriageData.length;
  var cols = vis.marriageData[0].length;
  vis.grid = d3.layout.grid()
    .bands()
    .rows(rows)
    .cols(cols)
    .nodeSize([vis.cellSize, vis.cellSize])
    .padding([vis.cellPadding, vis.cellPadding]);


  // initial data setup

  // merge all datasets into one
  vis.masterData = vis.familyData.map(function(d, i) {
    var marriages = arraySum(vis.marriageData[i]);
    var businessTies = arraySum(vis.businessTieData[i]);
    var relationships = marriages + businessTies;

    return {
      id: i,
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

  vis.wrangleData();
};

MatrixVis.prototype.wrangleData = function() {
  var vis = this;

  // update ordering of master data based on what the dropdown says
  var filterCriterion = $('#filter-control')
    .val();
  // sort a clone of the master data
  var sortedMasterData = vis.masterData.slice(0);

  if (filterCriterion === "default") {
    // don't change default sorting
  } else {
    // sort based on the `val` property of each family
    sortedMasterData.sort(function(a, b) {
      return b[filterCriterion] - a[filterCriterion];
    });
  }

  vis.displayData = sortedMasterData;

  vis.updateVis();
};

MatrixVis.prototype.updateVis = function() {
  var vis = this;

  var group = vis.svg.selectAll(".row")
    .data(vis.displayData, function(d) {
      return d.id;
    });

  var groupEnter = group.enter()
    .append("g")
    .attr("class", "row")
    .attr("id", function(d, i) {
      return d.id;
    });

  // ENTER
  // add static text
  groupEnter.append("text")
    .text(function(d) {
      return d.name;
  }).
  // vertically center on rest of row
  attr("y", (vis.cellSize + vis.cellPadding) * 1 / 2);

  // draw triangles
  var triangles = groupEnter.append("g")
    .attr("class", "triangles")
    .attr("id", function(d, i) {
      return d.id;
    });

  // draw marriage triangle
  triangles.selectAll(".marriage-triangle")
    .data(function(d) {
      console.log(d);
      return d.marriageValues;
    })
    .enter()
    .append("path")
    .attr("class", "marriage-triangle")
    .attr("fill", function(d) {
      // purple if married
      return d === 1 ? "purple" : "#DDD";
    })
    .attr("d", function(d, i) {
      var x = vis.margins.left + (i * vis.cellSize) + ((i + 1) * vis.cellPadding);
      var y = 0;

      return 'M ' + x + ' ' + y + ' l ' + vis.cellSize + ' 0 l 0 ' +
        vis.cellSize + ' z';
    });

  // draw business tie triangle
  triangles.selectAll(".business-triangle")
    .data(function(d) {
      console.log(d);
      return d.businessTieValues;
    })
    .enter()
    .append("path")
    .attr("class", "business-triangle")
    .attr("fill", function(d) {
      // purple if married
      return d === 1 ? "orange" : "#DDD";
    })
    .attr("d", function(d, i) {
      var x = vis.margins.left + (i * vis.cellSize) + ((i + 1) * vis.cellPadding);
      var y = 0;

      return 'M ' + x + ' ' + y + ' l 0 ' + vis.cellSize + ' l ' +
        vis.cellSize + ' 0 z'
    });

  // UPDATE
  // move the row around
  group.transition().attr("transform", function(d, i) {
    var left = 0;
    var top = vis.margins.top + (i * vis.cellSize) + ((i + 1) * vis.cellPadding);
    return "translate(" + left + "," + top +
      ")"
  })


  // exit
  group.exit()
    .remove();




  // draw triangles
  // var triangleGroups = d3.selectAll(".triangles");
  // triangleGroups.append("text").text(5);

  // vis.displayData.forEach(function(family, index) {
  //   var topMargin = vis.margins.top + (index * vis.cellSize);
  //   var group = vis.svg.append("g")
  //     .attr("class", "row")
  //     .attr("transform", "translate(" + 0 + "," + topMargin + ")");
  //
  //     // draw labels
  //     var labels = group.selectAll(".label").data(family);
  //
  //     // enter
  //     labels.enter().append("text").text(family.name);
  //
  //     // update
  //
  //
  //     // exit
  //     labels.exit().remove();
  // });



  // ENTER
  // var rowGroup =  vis.svg.selectAll(".row")
  //   .data(vis.displayData, function(d) {
  //     return d.name;
  //   })
  //   .enter()
  //   .append("g")
  //   .attr("class", "row")
  //   .attr("transform", function(d, i) {
  //     var left = 0;
  //     var top = vis.margins.top + (i * vis.cellSize);
  //     return "translate(" + left + "," + top +
  //       ")"
  //   });
  //
  //
  // rowGroup.append("text")
  //   // .attr("class", "label")
  //   .text(function(d) {
  //     return d.name;
  //   });
  //
  // // EXIT
  // rowGroup.exit()
  //   .remove();




  //

  // var rowLabels = rowLabelGroup.selectAll(".row-family-label")
  //   .data(vis.masterData, function(d) {
  //     return d.name;
  //   });
  //
  // rowLabels.enter()
  //   .append("text")
  //   .attr("class", "row-family-label");
  //
  // rowLabels.attr("x", function(d, i) {
  //     return 20;
  //   })
  //   .attr("y", function(d, i) {
  //     // Vertically center on squares
  //     return (i + 1 / 2) * vis.cellSize + (i + 1) * vis.cellPadding;
  //   })
  //   .text(function(d, i) {
  //     return d.name;
  //   });
  //
  // rowLabels.exit()
  //   .remove();

}
