/*
* Contains the logic for animating the charts and interacting with the buttons.
*/

// Some global parameters
var simulationRunning;
var simulationComplete;

var simulationData;
var numberHeads;
var numberTails;

var n;
var speed = 10;
var maxLines = 1000;
var maxFlips = 1000000;

// Create two line charts
var svgLineFull = new LineChart("#line-chart-full", false);
var svgLineReduced = new LineChart("#line-chart-reduced", true);

// Create two histograms charts
var histogramFull = new Histogram("#histogram-full");
var histogramReduced = new Histogram("#histogram-reduced");

// Function for updating and rendering all charts
async function updateChart() {
    if (simulationRunning) {
        if (n * maxLines < maxFlips * maxLines) {
            n = n * 1.025;

            // When we reach the end of our data set
            if (n * maxLines > maxFlips * maxLines) {
                n = maxFlips * maxLines / maxLines;
                simulationComplete = true;
                simulationRunning = false;

                // Update the button
                var buttonEle = document.getElementById("button-1");
                buttonEle.textContent = "Reset";
                buttonEle.onclick = resetSimulation;
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

function newSimulation() {

    // Update the button
    var buttonEle = document.getElementById("button-1");
    buttonEle.textContent = "Stop";
    buttonEle.onclick = stopSimulation;

    simulationRunning = true;
    simulationComplete = false;
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

function stopSimulation() {

    // Stop the simulation
    simulationRunning = false;

    // Update the button
    var buttonEle = document.getElementById("button-1");
    buttonEle.textContent = "Resume";
    buttonEle.onclick = resumeSimulation;

    // Create a reset button
    var resetButtonEle = document.createElement("BUTTON");
    resetButtonEle.innerHTML = "Reset";
    resetButtonEle.onclick = resetSimulation;
    resetButtonEle.id = "button-2";
    buttonEle.parentElement.append(resetButtonEle);
}

function resumeSimulation() {

    // Start the simulation
    simulationRunning = true;
    setTimeout(updateChart, speed);

    // Update the button
    var buttonEle = document.getElementById("button-1");
    buttonEle.textContent = "Stop";
    buttonEle.onclick = stopSimulation;

    // Remove the reset button
    var resetElement = document.getElementById("button-2");
    resetElement.parentNode.removeChild(resetElement);

}

function resetSimulation() {

    // Stop the simulation
    simulationRunning = false;

    // Remove the old line charts
    var lineFull = document.getElementById("line-chart-full");
    while (lineFull.firstChild) {
        lineFull.removeChild(lineFull.firstChild);
    }
    var lineReduced = document.getElementById("line-chart-reduced");
    while (lineReduced.firstChild) {
        lineReduced.removeChild(lineReduced.firstChild);
    }

    // Recreate the line charts
    svgLineFull = new LineChart("#line-chart-full", false);
    svgLineReduced = new LineChart("#line-chart-reduced", true);

    // Update the buttons
    var buttonEle = document.getElementById("button-1");
    buttonEle.textContent = "Start";
    buttonEle.onclick = newSimulation;

    // Remove the reset button if it still exists
    try {
        var resetElement = document.getElementById("button-2");
        resetElement.parentNode.removeChild(resetElement);
    }
    catch (e) { }

}