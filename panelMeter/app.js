var mtr1 = require('./meterOneCalibration.js');
var rpio = require('rpio');
var arg2 = Number(process.argv[2]);
var pin = 12;           // P12/GPIO18 (50uA panel meter connected via 56k ohm resistor)
var range = 500;        // max PWM that can be sent 
var clockdiv = 2048;    // Clock divider (PWM refresh rate), 8 == 2.4MHz
var mtr1Value = 0;      // Globatl value for meter 1

if (arg2){
    console.log("called with disply value = " + arg2);
    mtr1Value = arg2;
}

console.log("Setting up rpio object.");
rpio.open(pin, rpio.PWM);
rpio.pwmSetClockDivider(clockdiv);
rpio.pwmSetRange(pin, range);


console.log("Setting needel to " + mtr1Value + ", PWM = " + mtr1.getCalibratedPWM(mtr1Value));

rpio.pwmSetData(pin, mtr1.getCalibratedPWM(mtr1Value));

