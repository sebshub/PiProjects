// Objects
var mtr1 = require('./meterOneCalibration.js');
var rpio = require('rpio');

// Globals
var arg2 = Number(process.argv[2]);
var PNLpin = 12;        // P12/GPIO18 (50uA panel meter connected via 56k ohm resistor)
var LEDpin = 36;        // p36/GPIO 16 (LED connected to 240 ohm resistor)
var BTNpin = 32;        // p32/GPIO 12 (NO button connected to this pin and ground)
var range = 500;        // max PWM that can be sent 
var clockdiv = 2048;    // Clock divider (PWM refresh rate), 8 == 2.4MHz

// Exports
exports.setPanelMeter = setMeter;
exports.shutdown = shutdownMeter;
exports.LEDsetOnOff = LEDsetOnOff;

// Setup rpio objects
console.log("Setting up PWM object on GPIO pin " + PNLpin);
rpio.open(PNLpin, rpio.PWM);
rpio.pwmSetClockDivider(clockdiv);
rpio.pwmSetRange(PNLpin, range);

console.log("Setting up LED output on pin " + LEDpin);
rpio.open(LEDpin, rpio.OUTPUT, rpio.LOW);

console.log("Setting button input on pin " + BTNpin);
rpio.open(BTNpin, rpio.INPUT, rpio.PULL_UP);        // setup pin for input use internal pull up resistor
rpio.poll(BTNpin, pollcb);

// Demo by calling panelMeter.js object with meter value as argument
if (arg2){
    console.log("Running in test mode. Called with " + arg2);
    console.log("Setting needel to " + arg2 + ", PWM = " + mtr1.getCalibratedPWM(arg2));
    setMeter(arg2);
    
    console.log("LED = on");
    LEDsetOnOff(1);
}

// Functions
function setMeter(intVale){
    rpio.pwmSetData(PNLpin, mtr1.getCalibratedPWM(intVale));
    console.log("setMeter called with ->" + intVale + "<-, sent PWM value " + mtr1.getCalibratedPWM(intVale) + " to pin P" + PNLpin +".");
}

function shutdownMeter(){
    // Set Pin back to input to stop meter
    setMeter(0);
    rpio.open(PNLpin, rpio.INPUT);
    rpio.open(LEDpin, rpio.INPUT);    
}

function LEDsetOnOff(intOnOff) {
    if (intOnOff == 1){
        rpio.write(LEDpin, rpio.HIGH);
    } else {
        rpio.write(LEDpin, rpio.LOW);
    }
}

function pollcb(cbpin)
{
	var state = rpio.read(cbpin) ? 'released':'pressed';
	console.log('Button event on P%d (button currently %s)', cbpin, state);
    if (state == 'pressed'){
        LEDsetOnOff(1);
    } else {
        LEDsetOnOff(0);
    }
}

