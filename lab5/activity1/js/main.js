var svg;
var orderLabel;
var circleGroup;

var margin = {
  top: 100,
  left: 20,
  bottom: 20,
  right: 20
};




initializeVisualization();

function initializeVisualization() {
  // make svg
  svg = d3.select("#chart-holder")
    .append("svg")
    .attr('width', 600)
    .attr('height', 200);

  // initialize elements
  orderLabel = svg.append('text')
    .attr('x', margin.left)
    .attr('y', margin.top);

  var circleGroupLeftPadding = 120;
  circleGroup = svg.append('g')
    .attr('transform', 'translate(' + (margin.left + circleGroupLeftPadding) +
      ',' + margin.top + ')');
}

// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

function updateVisualization(orders) {
  console.log(orders);

  // update circles
      // Data-join (circle now contains the update selection)
    var circle = circleGroup.selectAll("circle")
        .data(orders);

    // Enter (initialize the newly added elements)
    circle.enter().append("circle")
        .attr("class", "dot")
        .attr("fill", function(d) {
			if (d.product == "tea") {
				return "#cdaa7d";
			} else {
				return "#8b2323";
			}
		});

    // Update (set the dynamic properties of the elements)
    var circleRadius = 40;
	var circlePadding = 15;
    circle
        .attr("r", function(d) { return circleRadius; })
        .attr("cx", function(d, index) { return (index * 2 + 1) * circleRadius + index * circlePadding })
        .attr("cy", 0);

		orderLabel.text("Orders: " + orders.length);

    // Exit
    circle.exit().remove();

}
