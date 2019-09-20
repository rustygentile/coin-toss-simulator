// WIP...
// TODO's: get the buttons working properly, parameterize...

var simRunning;

var simulationData;
var numberHeads;
var numberTails;

var n = 10;
var speed = 10;
var maxLines = 1000;

async function updateChart() {
    if (simRunning) {
        if (n * maxLines < 1000000000) {
            n = n * 1.01;
            if (n * maxLines > 1000000000) {
                n = 1000000000 / maxLines
            }
            var reducedData = [];
            for (var i = 0; i < maxLines; i++) {
                reducedData.push(simulationData[Math.round(i * n / 1000)]);
            }

            renderLineCharts(oldReducedData, reducedData, speed);
            oldReducedData = reducedData;
        }
        setTimeout(updateChart, speed);
    }
}

function runSim() {

    simRunning = true;
    simulationData = [];
    numberHeads = 0;
    numberTails = 0;

    for (var i = 1; i < 1000000; i++) {
        flipResult = Math.round(Math.random());
        if (flipResult === 0) {
            numberHeads += 1;
        } else {
            numberTails += 1;
        };
        probability = numberHeads / i;
        simulationData.push({ "flipNumber": i, "probability": probability });
    };

    oldReducedData = simulationData.slice(0, maxLines);
    
    if (simRunning) {
        setTimeout(updateChart, speed);
    }
    else {
        clearTimeout(updateChart);
    }
};

function stopSim() {
    simRunning = false;
}

function resetSim() {
    simRunning = false;
}