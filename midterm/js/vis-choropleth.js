

// --> CREATE SVG DRAWING AREA


// Use the Queue.js library to read two files

queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-water-sanitation-2015.csv")
  .await(function(error, mapTopJson, countryDataCSV){
    
    // --> PROCESS DATA

    // Update choropleth
    updateChoropleth();
  });
    

function updateChoropleth() {

  // --> Choropleth implementation

}