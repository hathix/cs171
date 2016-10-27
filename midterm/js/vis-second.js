// d3 tree visualization
// --> CREATE SVG DRAWING AREA
var outerWidth = 1000;
var outerHeight = 500;

var margin = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 300,
}

var innerWidth = outerWidth - margin.left - margin.right;
var innerHeight = outerHeight - margin.top - margin.bottom;

var options = {
    nodeRadius: 10
}

var vis = d3.select("#tree-holder")
  .append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

queue()
  .defer(d3.json, "data/water-requirement-hierarchy.json")
  .await(function(error, rawData) {
    // --> PROCESS DATA
    var treeData = rawData[0];

    // Create a tree "canvas"
    var tree = d3.layout.tree()
      .size([innerHeight, innerWidth]);

    var diagonal = d3.svg.diagonal()
      // change x and y (for the left to right tree)
      .projection(function(d) {
        return [d.y, d.x];
      });

    // Preparing the data for the tree layout, convert data into an array of nodes
    var nodes = tree.nodes(treeData);
    // Create an array with all the links
    var links = tree.links(nodes);

    console.log(treeData);
    console.log(nodes);
    console.log(links);


    // adapted from https://blog.pixelingene.com/2011/07/building-a-tree-diagram-in-d3-js/
    vis.selectAll("path.link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", diagonal);

    var nodeGroup = vis.selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // add circles
    nodeGroup.append("circle")
      .attr("class", "node-dot")
      .attr("r", options.nodeRadius);

    // add labels
    nodeGroup.append("text")
      .attr("text-anchor", function(d) {
        return d.children ? "end" : "start";
      })
      .attr("dx", function(d) {
        var gap = 2 * options.nodeRadius;
        return d.children ? -gap : gap;
      })
      .attr("dy", 3)
      .text(function(d) {
        return d.name;
      });


    // var link = vis.selectAll("path")
    //   .data(links)
    //   .enter()
    //   .append("path")
    //   .attr("class", "link")
    //   .attr("d", diagonal)
    //
    // var node = vis.selectAll("g.node")
    //   .data(nodes)
    //   .enter()
    //   .append("svg:g")
    //   .attr("transform", function(d) {
    //     return "translate(" + d.y + "," + d.x + ")";
    //   })
    //
    // // Add the dot at every node
    // node.append("svg:circle")
    //   .attr("r", 3.5);
    //
    // // place the name atribute left or right depending if children
    // node.append("svg:text")
    //   .attr("dx", function(d) {
    //     return d.children ? -8 : 8;
    //   })
    //   .attr("dy", 3)
    //   .attr("text-anchor", function(d) {
    //     return d.children ? "end" : "start";
    //   })
    //   .text(function(d) {
    //     return d.name;
    //   })

  });
