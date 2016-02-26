console.log("Setting up i2c object");

var i2c = require('i2c-bus'), i2c1 = i2c.openSync(1);
var HT16K33_ADDR = 0x70;     // Address of HT16K33
var fontLookup = require('./fontArray.js');

var x = "5".charCodeAt(0);
console.log ("The value for 5 (ASCII " + x + ") is >" + fontLookup.getChar(x));

// Turn on system oscillatior
i2c1.sendByteSync(HT16K33_ADDR, 0x21);
console.log("Turning on system oscillator...")

// Turn display on
i2c1.sendByteSync(HT16K33_ADDR, 0x81);
console.log("Powering up display...")

i2c1.closeSync();

