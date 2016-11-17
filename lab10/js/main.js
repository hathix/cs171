queue()
  .defer(d3.csv, "data/florentine-family-attributes.csv")
  .defer(d3.json, "data/matrices.json")
  .await(function(error, florentineFamilyData, matrixData) {
    if (error) {
      console.error(error);
    }
    console.info(florentineFamilyData);
    console.info(matrixData);

    // clean up data - convert each to an object
    // from 0/1's in marriages/business_ties matrices to
    // { marriage: 1, businessTie: 0  }
    // var rows = matrixData.marriages.length;
    // var cols = matrixData.marriages[0].length;
    // var combinedData = [];
    // for (var i = 0; i < rows; i++) {
    //     combinedData[i] = [];
    //     for (var j = 0; j < cols; j++) {
    //         combinedData[i][j] = {
    //             marriage: matrixData.marriages[i][j],
    //             businessTie: matrixData.business_ties[i][j],
    //         };
    //     }
    // }

    new MatrixVis("matrix-holder", florentineFamilyData, matrixData.marriages, matrixData.business_ties);
  });
