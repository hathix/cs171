var matrixVis;

queue()
  .defer(d3.csv, "data/florentine-family-attributes.csv")
  .defer(d3.json, "data/matrices.json")
  .await(function(error, florentineFamilyData, matrixData) {
    if (error) {
      console.error(error);
    }

    matrixVis = new MatrixVis("matrix-holder", florentineFamilyData,
      matrixData.marriages,
      matrixData.business_ties);
  });


$('#filter-control')
  .on('change', function() {
    matrixVis.wrangleData();
  });



/* HELPER FUNCTIONS */

/*
    Returns the sum of an array of numbers.
 */
function arraySum(array) {
  return array.reduce(function(a, b) {
    return a + b;
  }, 0);
}
