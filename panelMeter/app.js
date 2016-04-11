var rpio = require('rpio');
var arg2 = Number(process.argv[2]);
if (arg2){console.log("called with maxCalibrated = " + arg2);}


var pin = 12;                   /* P12/GPIO18 */
var range = 1024;               /* LEDs can quickly hit max brightness, so only use */
var MaxPossibeRange = 1024;     /* LEDs can quickly hit max brightness, so only use */
var clockdiv = 8;               /* Clock divider (PWM refresh rate), 8 == 2.4MHz */

var maxCalibrated = 512;
if (arg2 > 0 & arg2 < MaxPossibeRange){
    maxCalibrated = arg2;
    
}

console.log("Setting up rpio.");
rpio.open(pin, rpio.PWM);
rpio.pwmSetClockDivider(clockdiv);
rpio.pwmSetRange(pin, range);


console.log("Setting needel to " + maxCalibrated);

rpio.pwmSetData(pin, maxCalibrated);

