// Our histogram blueprint
class Histogram {

    constructor(elementName) {

        // Scales and axes
        this.x = d3.scaleLinear().range([0, width]);
        this.y = d3.scaleLinear().range([height, 0]);
        this.xAxis = d3.axisBottom().scale(this.x);
        this.yAxis = d3.axisLeft().scale(this.y);

        // Initialize svg element
        this.svg = d3.select(elementName)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin slice")
            .attr("viewBox", "0 0 480 320")
            .classed("svg-content", true)
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
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
            .text("Rel. freq.");

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
            .text("Count");

        // Initialize the bars
        this.dummyData = new Array(nBins).fill(0);
        this.bins = d3.histogram()
            .domain(this.x.domain())
            .thresholds(this.x.ticks(nBins))
            (this.dummyData);

        // Need to cast our functions to be able to use them
        var mX = this.x;
        var mY = this.y;

        // Initialize the bars with some dummy data
        this.bar = this.svg.selectAll(".bar")
            .data(this.bins)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) { return "translate(" + mX(d.x0) + "," + mY(d.length) + ")"; });

        this.bar.append("rect")
            .attr("x", 1)
            .attr("width", mX(this.bins[0].x1) - mX(this.bins[0].x0) - 1)
            .attr("height", function (d) { return height - mY(0); })
            .attr("fill", "steelblue");

    }
}