// panelMeter node class for the PI's GPIO based on the rpio class 
// Objects
var mtr1 = require('./meterOneCalibration.js');
var rpio = require('rpio');

// Globals
var arg2 = Number(process.argv[2]);
var PNLpin = 12;        // P12/GPIO18 (50uA panel meter connected via 56k ohm resistor)
//var LEDpin = 36;        // p36/GPIO 16 (LED connected to 240 ohm resistor)
var range = 500;        // max PWM that can be sent 
var clockdiv = 2048;    // Clock divider (PWM refresh rate), 8 == 2.4MHz


// Exports
exports.setPanelMeter = setMeter;
exports.shutdown = shutdownMeter;
//exports.LEDsetOnOff = LEDsetOnOff;


// Setup rpio objects
console.log("Setting up PWM object on GPIO pin " + PNLpin);
rpio.open(PNLpin, rpio.PWM);
rpio.pwmSetClockDivider(clockdiv);
rpio.pwmSetRange(PNLpin, range);



// Demo by calling panelMeter.js object with meter value as argument
if (arg2){
    console.log("Running in test mode. Called with " + arg2);
    console.log("Setting needel to " + arg2 + ", PWM = " + mtr1.getCalibratedPWM(arg2));
    setMeter(arg2);
    
    console.log("LED = on");
    LEDsetOnOff(1);
}

// Exported Functions
function setMeter(intVale){
    rpio.pwmSetData(PNLpin, mtr1.getCalibratedPWM(intVale));
    console.log("setMeter called with ->" + intVale + "<-, sent PWM value " + mtr1.getCalibratedPWM(intVale) + " to pin P" + PNLpin +".");
}

function shutdownMeter(){
    // Set Pin back to input to stop meter
    setMeter(0);
   
}

