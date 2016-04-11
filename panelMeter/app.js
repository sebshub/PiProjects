var rpio = require('rpio');
var arg2 = Number(process.argv[2]);
var arg3 = Number(process.argv[3]);

if (arg2){console.log("called with maxCalibrated = " + arg2);}
if (arg3){console.log("called with range = " + arg3);}

var pin = 12;                   /* P12/GPIO18 */
var range = 100;               /* LEDs can quickly hit max brightness, so only use */
var clockdiv = 2048;               /* Clock divider (PWM refresh rate), 8 == 2.4MHz */

var maxCalibrated = 85;
if (arg2 > 0 & arg2 < range){maxCalibrated = arg2;}
if (arg3){range = arg3;}

console.log("Setting up rpio.");
rpio.open(pin, rpio.PWM);
//rpio.pwmSetClockDivider(clockdiv);
//rpio.pwmSetRange(pin, range);


console.log("Setting needel to " + maxCalibrated);

rpio.pwmSetData(pin, maxCalibrated);

