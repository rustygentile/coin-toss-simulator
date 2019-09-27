// Our line chart blueprint
class LineChart {

    constructor(elementName, windowed) {

        // Scales and axes
        this.x = d3.scaleLinear().range([0, width]);
        this.y = d3.scaleLinear().range([height, 0]);
        this.xAxis = d3.axisBottom().scale(this.x);
        this.yAxis = d3.axisLeft().scale(this.y);

        // Initialize SVG elements
        this.svg = d3.select(elementName)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 480 320")
            .classed("svg-content", true)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Initialise x axis
        this.x.domain([0, 1]);
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "lineChartXAxis")
            .call(this.xAxis);

        // x axis label
        this.svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("# flips");

        // Initialize y axis
        this.y.domain([0, 1]);
        this.svg.append("g")
            .attr("class", "lineChartYAxis")
            .call(this.yAxis);

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

        if (!windowed) {
            this.svg.append("line")
                .attr("id", "top_line")
                .attr("class", "dashed")
                .attr("stroke", "grey")
                .attr("stroke-width", 0.5)
                .attr("x1", 0)
                .attr("y1", 1)
                .attr("x2", 1)
                .attr("y2", 1);
            this.svg.append("line")
                .attr("id", "bottom_line")
                .attr("class", "dashed")
                .attr("stroke", "grey")
                .attr("stroke-width", 0.5)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 1)
                .attr("y2", 0);
        }
    };
};


// For updating the charts with new data
function renderLineCharts(oldData, newData, speed, svgLineFull, svgLineReduced) {

    // Calculate our moving window based on the filtered data set
    var xWindowMin = d3.min(newData.slice(dropRows), function (d) { return d.flipNumber });
    var xWindowMax = d3.max(newData.slice(dropRows), function (d) { return d.flipNumber });
    var yWindowMin = d3.min(newData.slice(dropRows), function (d) { return d.probability });
    var yWindowMax = d3.max(newData.slice(dropRows), function (d) { return d.probability });

    // Make sure the y axis is centered at 0.5
    if (0.5 - yWindowMin > yWindowMax - 0.5) {
        yWindowMax = 0.5 + (0.5 - yWindowMin);
    }
    else {
        yWindowMin = 0.5 - (yWindowMax - 0.5);
    }

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