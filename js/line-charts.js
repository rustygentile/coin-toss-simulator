
// Dimensions and margins
var margin = { top: 20, right: 20, bottom: 50, left: 70 }
var width = 480 - margin.left - margin.right;
var height = 320 - margin.top - margin.bottom;

// Use this to reduce the data in our second plot
var dropRows = 100;

// Our line chart blueprint
class LineChart {

    constructor(elementName) {

        // Scales and axes
        this.x = d3.scaleLinear().range([0, width]);
        this.y = d3.scaleLinear().range([height, 0]);
        this.xAxis = d3.axisBottom().scale(this.x);
        this.yAxis = d3.axisLeft().scale(this.y);

        // Initialize SVG elements
        this.svg = d3.select(elementName)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Initialise x axis
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "lineChartXAxis");

        // x axis label
        this.svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("# flips");

        // Initialize y axis
        this.svg.append("g")
            .attr("class", "lineChartYAxis");

        // y axis label
        this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Rel. freq.");

        // Initialize line
        this.svg.append("path")
            .attr("id", "line_chart_path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5);
    }
};


// Create two line charts
var svgLineFull = new LineChart("#line_chart_full");
var svgLineReduced = new LineChart("#line_chart_reduced");

// For updating the charts with new data
function renderLineCharts(oldData, newData, speed) {

    // Calculate our moving window based on the filtered data set
    var yWindowMin = d3.min(newData.slice(dropRows), function (d) { return d.probability });
    var yWindowMax = d3.max(newData.slice(dropRows), function (d) { return d.probability });
    var xWindowMin = d3.min(newData.slice(dropRows), function (d) { return d.flipNumber });
    var xWindowMax = d3.max(newData.slice(dropRows), function (d) { return d.flipNumber });

    // For the full chart, we fix the x axis to start at 0...
    svgLineFull.x.domain(
        [0, xWindowMax]
    );
    svgLineFull.svg.selectAll(".lineChartXAxis").transition()
        .transition()
        .duration(speed)
        .call(svgLineFull.xAxis);

    // ...and we fix the y-axis from 0 to 1
    svgLineFull.y.domain(
        [0, 1]
    );

    svgLineFull.svg.selectAll(".lineChartYAxis")
        .transition()
        .duration(speed)
        .call(svgLineFull.yAxis);

    var fullLine = d3.line()
        .x(function (d) { return svgLineFull.x(d.flipNumber) })
        .y(function (d) { return svgLineFull.y(d.probability) });

    svgLineFull.svg.select('#line_chart_path')
        .attr('d', fullLine(oldData))
        .transition()
        .attr('d', fullLine(newData))
        .duration(speed);

    // Create the X axis:
    svgLineReduced.x.domain(
        [xWindowMin, xWindowMax]
    );
    svgLineReduced.svg.selectAll(".lineChartXAxis").transition()
        .transition()
        .duration(speed)
        .call(svgLineReduced.xAxis);

    // create the Y axis
    svgLineReduced.y.domain(
        [yWindowMin, yWindowMax]
    );
    svgLineReduced.svg.selectAll(".lineChartYAxis")
        .transition()
        .duration(speed)
        .call(svgLineReduced.yAxis);

    var reducedLine = d3.line()
        .x(function (d) { return svgLineReduced.x(d.flipNumber) })
        .y(function (d) { return svgLineReduced.y(d.probability) });

    svgLineReduced.svg.select('#line_chart_path')
        .attr('d', reducedLine(oldData.slice(dropRows)))
        .transition()
        .attr('d', reducedLine(newData.slice(dropRows)))
        .duration(speed)
};