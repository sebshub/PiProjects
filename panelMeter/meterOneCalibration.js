/*
/ CalibrationTable is used to lookup the correct PMW setting for a given value on the panel meter.  
/ This table will be unique per panel meter.  The values must be in order of small to large and the length
/ can very.  The first element of the two dimensional array is the meter value and the 2nd element is the
/ pwm setting that positions the needle to the correct position.  
*/
var calibrationTable = [[0,0],[5,36],[10,76],[15,118],[20,159],[25,200],[30,243],[35,286],[40,331],[45,374],[50,425]];

exports.getCalibratedPWM = findCalibratedValue;

// Functions
function findCalibratedValue(intVal){
    if (intVal < calibrationTable[0][0]){return calibrationTable[0][0];}
    if (intVal > calibrationTable[calibrationTable.length-1][0]){return calibrationTable[calibrationTable.length-1][1];}
    var lowIndex = findLowIndex(intVal);
    var highIndex = findHighIndex(intVal);
    if (lowIndex == highIndex){
        return calibrationTable[lowIndex][1];
    } else {
        var range = calibrationTable[highIndex][0] - calibrationTable[lowIndex][0];    
        var ticsPerValue = (calibrationTable[highIndex][1] - calibrationTable[lowIndex][1]) / range;
        return ((intVal - calibrationTable[lowIndex][0]) * ticsPerValue) + calibrationTable[lowIndex][1];   
    }
}

function findHighIndex(target) {
    for (i=0; i < calibrationTable.length; i++){
        if (calibrationTable[i][0] >= target){
            return i;
        }
    }
}

function findLowIndex(target) {
    for (i=calibrationTable.length - 1; i > -1; i--){
        if (calibrationTable[i][0] <= target){
            return i;
        }
    }
}

function printCalibrationTable() {
    for (i = 0; i < calibrationTable.length; i++){
        console.log("#" + i + ": " + calibrationTable[i][0] + " = " + calibrationTable[i][1]);
    }    
}
