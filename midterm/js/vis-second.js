// d3 tree visualization
var outerWidth = 1000;
var outerHeight = 500;

var margin = {
  top: 30,
  bottom: 30,
  left: 150,
  right: 300
}

var innerWidth = outerWidth - margin.left - margin.right;
var innerHeight = outerHeight - margin.top - margin.bottom;

var options = {
  nodeRadius: 10
};

// create svg
var vis = d3.select("#tree-holder")
  .append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight)
  .attr("class", "centered")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load data
queue()
  .defer(d3.json, "data/water-requirement-hierarchy.json")
  .await(function(error, rawData) {
    // --> PROCESS DATA
    var treeData = rawData[0];

    // Create tree
    var tree = d3.layout.tree()
      .size([innerHeight, innerWidth]);

    var diagonal = d3.svg.diagonal()
      // we want tree to be left-to-right, so swap directions
      .projection(function(d) {
        return [d.y, d.x];
      });

    // preprocess the nodes and edges of the tree
    var nodes = tree.nodes(treeData);
    var links = tree.links(nodes);

    // draw tree
    // the below is all adapted from
    // https://blog.pixelingene.com/2011/07/building-a-tree-diagram-in-d3-js/
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
        // position
        return "translate(" + d.y + "," + d.x + ")";
      });

    // add circles for nodes
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
  });
