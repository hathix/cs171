
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

PrioVis = function(_parentElement, _data, _metaData){
	this.parentElement = _parentElement;
	this.data = _data;
	this.metaData = _metaData;

	this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

PrioVis.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 20, right: 0, bottom: 200, left: 140 };

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
	vis.height = 500 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


	// Scales and axes
	vis.x = d3.scale.ordinal()
			.rangeBands([0, vis.width], .2)
			.domain(d3.range(0,15));

	vis.y = d3.scale.linear()
			.range([vis.height,0]);

	vis.xAxis = d3.svg.axis()
			.scale(vis.x)
			.orient("bottom");

	vis.yAxis = d3.svg.axis()
			.scale(vis.y)
			.orient("left");

	vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

	vis.svg.append("g")
			.attr("class", "y-axis axis");

	// Axis title
	vis.svg.append("text")
			.attr("x", -50)
			.attr("y", -8)
			.text("Votes");


	// (Filter, aggregate, modify data)
	vis.wrangleData();
}


/*
 * Data wrangling
 */

PrioVis.prototype.wrangleData = function(){
	var vis = this;


	// Create a sequence of values from 0 - 14 (priorities: 1-15; array length: 15)
	var votesPerPriority = d3.range(0, 15).map(function(x) {
		return x + 1;
	});

	// Iterate over each day, summing the data into `votesPerPriority`
	vis.data.forEach(function(day) {
		// has an array `priorities` from 1-15 inclusive
		// add it to our existing counter
		day.priorities.map(function(d, i) {
			votesPerPriority[i] += d;
		});
	});

	vis.displayData = votesPerPriority;

	// Update the visualization
	vis.updateVis();
}


/*
 * The drawing function
 */

PrioVis.prototype.updateVis = function(){
	var vis = this;

	// Update domains
	vis.y.domain([0, d3.max(vis.displayData)]);


	// Draw actual bars
	var bars = vis.svg.selectAll(".bar")
			.data(this.displayData)

	bars.enter().append("rect")
			.attr("class", "bar");

	bars
			.transition()
			.attr("width", vis.x.rangeBand())
			.attr("height", function(d){
				return vis.height - vis.y(d);
			})
			.attr("x", function(d, index){
				return vis.x(index);
			})
			.attr("y", function(d){
				return vis.y(d);
			});

	bars.exit().remove();


	// Call axis function with the new domain
	vis.svg.select(".y-axis").call(vis.yAxis);

	vis.svg.select(".x-axis").call(vis.xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d) {
					return "rotate(-45)"
			});
}


PrioVis.prototype.onSelectionChange = function(selectionStart, selectionEnd){
	var vis = this;


	// Filter data depending on selected time period (brush)

	// *** TO-DO ***


	vis.wrangleData();
}
