console.log("Setting up i2c object");
var i2c = require('i2c-bus'), i2c1 = i2c.openSync(1);
var HT16K33_ADDR = 0x70;     // Address of HT16K33
var fontLookup = require('./fontArray.js');

exports.prnStr = prnStr;
exports.prnFltStr = prnFltStr;

// Turn on system oscillatior
i2c1.sendByteSync(HT16K33_ADDR, 0x21);
console.log("Turning on display's oscillator...")

// Turn display on
i2c1.sendByteSync(HT16K33_ADDR, 0x81);
console.log("Powering up display...")

prnStr(" OK ");

i2c1.closeSync();

function prnStrOld (stringToDisplay){
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

function prnFltStr (stringToDisplay){
  var xStr = stringToDisplay;

  console.log("Displaying ->" + xStr + "<-");
  var charWord = fontLookup.getChar(xStr.charCodeAt(0));
  i2c1.writeWordSync(HT16K33_ADDR, 0x00, charWord);
  
  charWord = fontLookup.getChar(xStr.charCodeAt(1));
  charWord = charWord | 0x4000;    // Or with 0x4000 to turn on decimal point
  i2c1.writeWordSync(HT16K33_ADDR, 0x02, charWord);
  
  charWord = fontLookup.getChar(xStr.charCodeAt(3));
  i2c1.writeWordSync(HT16K33_ADDR, 0x04, charWord);
    
  charWord = fontLookup.getChar(xStr.charCodeAt(4));
  i2c1.writeWordSync(HT16K33_ADDR, 0x06, charWord);    
}

function prnStr (strIn){
  var dpLocation = -1;
  var stringToDisplay = "";    
  var x = 0;
  
    // Look for decimal point, mark locaiton and pull it out of string
    while (x < strIn.length){
        if (strIn.charCodeAt(x) == 46){
            dpLocation = x;
        } else {
            stringToDisplay = stringToDisplay.concat(strIn.charAt(x)); 
        }
        x++;     
    }        
  
  // format string based on size  
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
  if (dpLocation != -1){
      console.log("Found decimal point after char #" + dpLocation);
  } 
  
  // Send charcter string to display one word at a time
  var charWord = fontLookup.getChar(xStr.charCodeAt(0));
  if (dpLocation == 1){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point
  i2c1.writeWordSync(HT16K33_ADDR, 0x00, charWord);
  
  charWord = fontLookup.getChar(xStr.charCodeAt(1));
  if (dpLocation == 2){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point  
  i2c1.writeWordSync(HT16K33_ADDR, 0x02, charWord);
  
  charWord = fontLookup.getChar(xStr.charCodeAt(2));
  if (dpLocation == 3){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point  
  i2c1.writeWordSync(HT16K33_ADDR, 0x04, charWord); 
   
  charWord = fontLookup.getChar(xStr.charCodeAt(3));
  if (dpLocation == 4){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point  
  i2c1.writeWordSync(HT16K33_ADDR, 0x06, charWord);    
}

