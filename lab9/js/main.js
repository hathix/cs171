
var allData = [];

// Variable for the visualization instance
var stationMap;

// Start application by loading the data
loadData();


function loadData() {

	// Proxy url
	var proxy = 'http://michaeloppermann.com/proxy.php?format=xml&url=';

  // Hubway XML station feed
  var url = 'https://www.thehubway.com/data/stations/bikeStations.xml';

  // TO-DO: LOAD DATA
  console.log("fetching data");
  $.getJSON(proxy + url, function(data){
	  console.log("got data", data);
	  var stations = data.station;

	  // create a map of boston
	  var stationMap = new StationMap("station-map", stations, [42.360082, -71.058880]);
  });
}
