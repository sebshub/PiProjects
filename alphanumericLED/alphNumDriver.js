console.log("Setting up i2c object");
var i2c = require('i2c-bus'), i2c1 = i2c.openSync(1);
var HT16K33_ADDR = 0x70;     // Address of HT16K33
var fontLookup = require('./fontArray.js');

// Turn on system oscillatior
i2c1.sendByteSync(HT16K33_ADDR, 0x21);
console.log("Turning on display's oscillator...")

// Turn display on
i2c1.sendByteSync(HT16K33_ADDR, 0x81);
console.log("Powering up display...")

this.prnStr(" OK ");

exports.prnStr = function (stringToDisplay){
  var xStr = "";
  if (stringToDisplay.length == 1){
    xStr = "   " + stringToDisplay;
  } else if (stringToDisplay.length == 2){
    xStr = "  " + stringToDisplay;
  } else if (stringToDisplay.length == 3){
    xStr = " " + stringToDisplay;
  } else {
    xStr = stringToDisplay;
  }
  console.log("Displaying ->" + xStr + "<-");
  var charWord = fontLookup.getChar(xStr.charCodeAt(0));
  i2c1.writeWordSync(HT16K33_ADDR, 0x00, charWord);
  charWord = fontLookup.getChar(xStr.charCodeAt(1));
  i2c1.writeWordSync(HT16K33_ADDR, 0x02, charWord);
  charWord = fontLookup.getChar(xStr.charCodeAt(2));
  i2c1.writeWordSync(HT16K33_ADDR, 0x04, charWord);  
  charWord = fontLookup.getChar(xStr.charCodeAt(3));
  i2c1.writeWordSync(HT16K33_ADDR, 0x06, charWord);    
}

i2c1.closeSync();
