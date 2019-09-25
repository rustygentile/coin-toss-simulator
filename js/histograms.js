// Our histogram blueprint
class histogram {

    constructor(elementName) {

        // Scales and axes
        this.x = d3.scaleLinear().range([0, width]);
        this.y = d3.scaleLinear().range([height, 0]);
        this.xAxis = d3.axisBottom().scale(this.x);
        this.yAxis = d3.axisLeft().scale(this.y);

        // Initialize svg element
        this.svg = d3.select(elementName)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    
        
    }
}