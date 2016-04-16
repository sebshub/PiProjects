// Objects
var mtr1 = require('./meterOneCalibration.js');
var rpio = require('rpio');

// Globals
var arg2 = Number(process.argv[2]);
var pin = 12;           // P12/GPIO18 (50uA panel meter connected via 56k ohm resistor)
var LEDpin = 36;        // p36/GPIO 16 (LED connected to 240 ohm resistor)
var range = 500;        // max PWM that can be sent 
var clockdiv = 2048;    // Clock divider (PWM refresh rate), 8 == 2.4MHz

// Exports
exports.setPanelMeter = setMeter;
exports.shutdown = shutdownMeter;

// Setup rpio objects
console.log("Setting up PWM object on GPIO pin " + pin);
rpio.open(pin, rpio.PWM);
rpio.pwmSetClockDivider(clockdiv);
rpio.pwmSetRange(pin, range);

console.log("Setting up LED output on pin " + LEDpin);
rpio.open(LEDpin, rpio.OUTPUT, rpio.LOW);

// Demo by calling panelMeter.js object with meter value as argument
if (arg2){
    console.log("Running in test mode. Called with " + arg2);
    console.log("Setting needel to " + arg2 + ", PWM = " + mtr1.getCalibratedPWM(arg2));
    setMeter(arg2);
    
    console.log("LED = on");
    LEDsetOnOff(1);
    
    console.log("Sleeping for 5 seconds");
    rpio.msleep(5000);
}

// Functions
function setMeter(intVale){
    rpio.pwmSetData(pin, mtr1.getCalibratedPWM(intVale));
    console.log("setMeter called with ->" + intVale + "<-, sent PWM value " + mtr1.getCalibratedPWM(intVale) + " to pin P" + pin +".");
}

function shutdownMeter(){
    // Set Pin back to input to stop meter
    rpio.open(pin, rpio.INPUT);
}

function LEDsetOnOff(intOnOff) {
    if (intOnOff == 1){
        rpio.write(LEDpin, rpio.HIGH);
    } else {
        rpio.write(LEDpin, rpio.LOW);
    }
    
}