console.log("Setting up i2c object");
var i2c = require('i2c-bus'), i2c1 = i2c.openSync(1);
var HT16K33_ADDR = 0x70;     // Address of HT16K33
var fontLookup = require('./fontArray.js');

exports.prnStr = prnStr;
exports.setBright = setBright;

// Turn on system oscillatior
i2c1.sendByteSync(HT16K33_ADDR, 0x21);
console.log("Turning on display's oscillator...")

// Turn display on
i2c1.sendByteSync(HT16K33_ADDR, 0x81);
console.log("Powering up display...")

prnStr(" OK ");

i2c1.closeSync();

function setBright(intDuty){                // value = 1 to 16 Sets the duty cycle of display
    var bLvl = 8;
    
    // Turn display on
    i2c1.sendByteSync(HT16K33_ADDR, 0xE0 + bLvl );
    console.log("Setting Display to 8")
    
}


function prnStr (strIn){                    // Prints string with decimal point support
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
    if (dpLocation != -1){dpLocation = dpLocation + 3};     //Move decimal location based on spaces added
  } else if (stringToDisplay.length == 2){
    xStr = "  " + stringToDisplay;
    if (dpLocation != -1){dpLocation = dpLocation + 2};     //Move decimal location based on spaces added
  } else if (stringToDisplay.length == 3){
    xStr = " " + stringToDisplay;
    if (dpLocation != -1){dpLocation = dpLocation + 1};     //Move decimal location based on spaces added
  } else {
    xStr = stringToDisplay;
  }
  
  if (dpLocation != -1){
      console.log("prnStr called with ->" + strIn + "<-, displaying ->" + xStr + "<- with decimal point after char #" + dpLocation + ".");
  } else {
      console.log("prnStr called with ->" + strIn + "<-, displaying ->" + xStr + "<-.");    
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

