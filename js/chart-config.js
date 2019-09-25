/*
Some common config parameters for the charts.
*/

// Dimensions and margins
if (screen.width < 960) {

    var margin = { top: 20, right: 20, bottom: 50, left: 70 }
    var width = 320 - margin.left - margin.right;
    var height = 200 - margin.top - margin.bottom;

}
else {

    var margin = { top: 20, right: 20, bottom: 50, left: 70 }
    var width = 480 - margin.left - margin.right;
    var height = 320 - margin.top - margin.bottom;

};

// Use this to reduce the data in our second set of plots
var dropRows = 100;

var nBins = 100;