// Some global parameters
var simulationRunning;

var simulationData;
var numberHeads;
var numberTails;

var n;
var speed = 10;
var maxLines = 1000;
var maxFlips = 1000000;

// Create two line charts
var svgLineFull = new LineChart("#line_chart_full");
var svgLineReduced = new LineChart("#line_chart_reduced");

// Function for updating and rendering all charts
async function updateChart() {
    if (simulationRunning) {
        if (n * maxLines < maxFlips * maxLines) {
            n = n * 1.025;
            if (n * maxLines > maxFlips * maxLines) {
                n = maxFlips * maxLines / maxLines;
            }
            var reducedData = [];
            for (var i = 0; i < maxLines; i++) {
                reducedData.push(simulationData[Math.round(i * n / maxLines)]);
            }
            renderLineCharts(oldReducedData, reducedData, speed, svgLineFull, svgLineReduced);
            oldReducedData = reducedData;
        }
        setTimeout(updateChart, speed);
    }
}

function runSim() {

    // Update the button
    var buttonEle = document.getElementById("button1");
    buttonEle.textContent = "Stop Simulation";
    buttonEle.onclick = stopSim;

    simulationRunning = true;
    simulationData = [];
    numberHeads = 0;
    numberTails = 0;
    n = 10;

    for (var i = 1; i < maxFlips; i++) {
        flipResult = Math.round(Math.random());
        if (flipResult === 0) {
            numberHeads += 1;
        } else {
            numberTails += 1;
        };
        probability = numberHeads / i;
        simulationData.push({ "flipNumber": i, "probability": probability });
    };

    oldReducedData = simulationData.slice(0, 1);

    if (simulationRunning) {
        setTimeout(updateChart, speed);
    }
    else {
        clearTimeout(updateChart);
    }
};

function stopSim() {

    // Stop the simulation
    simulationRunning = false;

    // Update the button
    var buttonEle = document.getElementById("button1");
    buttonEle.textContent = "Reusme Simulation";
    buttonEle.onclick = resumeSim;
}

function resumeSim() {

    // Start the simulation
    simulationRunning = true;
    setTimeout(updateChart, speed);

    // Update the button
    var buttonEle = document.getElementById("button1");
    buttonEle.textContent = "Stop Simulation";
    buttonEle.onclick = stopSim;

}

function resetSim() {

    // Stop the simulation
    simulationRunning = false;

    // Remove the old line charts
    var lineFull = document.getElementById("line_chart_full");
    while (lineFull.firstChild) {
        lineFull.removeChild(lineFull.firstChild);
    }
    var lineReduced = document.getElementById("line_chart_reduced");
    while (lineReduced.firstChild) {
        lineReduced.removeChild(lineReduced.firstChild);
    }

    // Recreate the line charts
    svgLineFull = new LineChart("#line_chart_full");
    svgLineReduced = new LineChart("#line_chart_reduced");

    // Update the button
    var buttonEle = document.getElementById("button1");
    buttonEle.textContent = "Start Simulation";
    buttonEle.onclick = runSim;
}