/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapCenter) {

  this.parentElement = _parentElement;
  this.data = _data;
  this.mapCenter = _mapCenter;

  this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
  var vis = this;

  // set up leaflet
  vis.map = L.map(vis.parentElement)
    .setView(vis.mapCenter, 13);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(vis.map);

  // add link to images
  L.Icon.Default.imagePath = 'css/images/';

  vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
  var vis = this;

  // Currently no data wrangling/filtering needed
  vis.displayData = vis.data;

  // Update the visualization
  vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {
	var vis = this;

  console.log(this.displayData);

  // draw 1 pin per station
  vis.displayData.forEach(function(d) {
	  var lat = +d.lat;
	  var long = +d.long;
	  L.marker([d.lat, d.long]).addTo(vis.map);
  })
}
