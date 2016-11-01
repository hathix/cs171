

// Function to convert date objects to strings or reverse
var dateFormatter = d3.time.format("%Y-%m-%d");


// (1) Load data asynchronously
queue()
	.defer(d3.json,"data/perDayData.json")
	.defer(d3.json,"data/myWorldFields.json")
	.await(createVis);


function createVis(error, perDayData, metaData){
	if(error) { console.log(error); }

	// (2) Make our data look nicer and more useful
	allData = perDayData.map(function (d) {

		var result = {
			time: dateFormatter.parse(d.day),
			count: +d["count(*)"] + 1
		};

		// Convert votes for the 15 priorities from key-value format into one single array (for each day)
		result.priorities = d3.range(0,15).map(function(counter){
			return d["sum(p"+counter+")"]
		});
		// [d["sum(p0)"], d["sum(p1)"], d["sum(p2)"],...]
		// Example: [10,200,500,... ]

		// Create an array of values for age 0 - 99
		result.ages = d3.range(0,99).map(function(){
			return 0;
		});

		// Insert the votes in the newly created array 'result.ages'
		d.age.forEach(function(a){
			if(a.age < 100){
				result.ages[a.age] = a["count(*)"];
			}
		})

		return result;
	});


	// (3) Create event handler

	// *** TO-DO ***



	// (4) Create visualization instances
	var countVis = new CountVis("countvis", allData);
	var ageVis = new AgeVis("agevis", allData);
	var prioVis = new PrioVis("priovis", allData);

	// *** TO-DO ***



	// (5) Bind event handler

	// *** TO-DO ***

}
