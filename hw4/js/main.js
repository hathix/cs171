d3.csv("data/refugee.csv", function(data) {


    // clean up loaded information
    // dates are in a format like "2013-01-23"
    var timeFormat = d3.time.format("%Y-%m-%d");
    data.forEach(function(d) {
        d.population = parseInt(d.population);
        d.date = timeFormat.parse(d.date);
    });

    console.log(data);
});
