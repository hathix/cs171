d3.queue()
  .defer(d3.csv, "data/florentine-family-attributes.csv")
  .defer(d3.json, "data/matrices.json")
  .await(function(error, florentineFamilyData, matrixData) {

    new MatrixVis("matrix-holder", matrixData.marriages);
  });
