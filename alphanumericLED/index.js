console.log("Setting up i2c object");

var i2c = require('i2c-bus'), i2c1 = i2c.openSync(1);
var HT16K33_ADDR = 0x70;     // Address of HT16K33
var fontLookup = require('./fontArray.js');

// Turn on system oscillatior
i2c1.sendByteSync(HT16K33_ADDR, 0x21);
console.log("Turning on system oscillator...")

// Turn display on
i2c1.sendByteSync(HT16K33_ADDR, 0x81);
console.log("Powering up display...")

var x = "5".charCodeAt(0);
var charWord = fontLookup.getChar(x);
console.log("sending 5 (ASCII " + x + ") is >" + charWord);
i2c1.writeWordSync(HT16K33_ADDR, 0x00, charWord);
i2c1.writeWordSync(HT16K33_ADDR, 0x02, charWord);


i2c1.closeSync();

