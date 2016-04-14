console.log("Setting up i2c object");
var i2c = require('i2c-bus'), i2c1 = i2c.openSync(1);
var AlphNum1_Add = 0x70;     // Address of first HT16K33 LEDS
var AlphNum2_Add = 0x71;     // Address of second bank.  Set to null if not attached
var fontLookup = require('./fontArray.js');

var dsplyOnOff = 1;                         // 1 = On
var dsplyBlink = 0;                         // 0 = No blinking

exports.prnStr = prnStr;
exports.setBright = setBright;
exports.blinkDisplay = blinkDisplay;

// Turn on system oscillatior
i2c1.sendByteSync(AlphNum1_Add, 0x21);
if (AlphNum2_Add){i2c1.sendByteSync(AlphNum2_Add, 0x21);}           // If AlphNum2_ADD not null setup second display bank
console.log("Turning on display's oscillator...")

// Turn display on
i2c1.sendByteSync(AlphNum1_Add, 0x81);
if (AlphNum2_Add){i2c1.sendByteSync(AlphNum1_Add, 0x81);}           // If AlphNum2_ADD not null turn on display
console.log("Powering up display...")

// Display OK
if (AlphNum2_Add){
    _prnStrs(" ON-", AlphNum1_Add);
    _prnStrs("LINE", AlphNum2_Add);
} else {
    prnStr(" OK ");
}

// Set to max bright
setBright(15);

i2c1.closeSync();

function blinkDisplay(intRate){             // intRate from 0 (no blinking) to 3 (fast blinking)
    var bRate = 0;
    if(intRate > -1 && intRate < 4){
        bRate = intRate;   
    } else {
        console.log("blinkDisplay called with invalid parameter ->" + intRate);        
    }
    
    dsplyBlink = bRate << 1                 // Shift bits one to left into displyBlink global
    bRate = dsplyBlink | dsplyOnOff;        // OR with dsplyOnOff global to get value to send to register
    bRate = 0x80 + bRate;                   // 0x80 is OnOff and Blinking register address
    i2c1.sendByteSync(AlphNum1_Add, bRate);
    console.log("Setting Blink to " + bRate);    
}

function setBright(intDuty){                // integer from 0 (dim) to 15 (bright) Sets the duty cycle of display
    var bLvl = 15;
    if (intDuty > -1 && intDuty < 16){
        bLvl = intDuty;    
    } else {
        console.log("setBright called with invalid parameter ->" + intDuty);
    }
    
    bLvl = 0xE0 + bLvl;                     // 0xE0 is Dimming register
    i2c1.sendByteSync(AlphNum1_Add, bLvl);
    console.log("Setting Display to " + bLvl);  
}

function prnStr (strIn){
    _prnStrs(strIn, AlphNum1_Add)    
}

function _prnStrs (strIn, bankAdd){                    // Prints string with decimal point support
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
    
    // Send charcter string to display one word at a time
    var charWord = fontLookup.getChar(xStr.charCodeAt(0));
    if (dpLocation == 1){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point
    i2c1.writeWordSync(bankAdd, 0x00, charWord);
    charWord = fontLookup.getChar(xStr.charCodeAt(1));
    if (dpLocation == 2){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point  
    i2c1.writeWordSync(bankAdd, 0x02, charWord);
    charWord = fontLookup.getChar(xStr.charCodeAt(2));
    if (dpLocation == 3){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point  
    i2c1.writeWordSync(bankAdd, 0x04, charWord); 
    charWord = fontLookup.getChar(xStr.charCodeAt(3));
    if (dpLocation == 4){charWord = charWord | 0x4000; }      // Or with 0x4000 to turn on decimal point  
    i2c1.writeWordSync(bankAdd, 0x06, charWord);    
    
    // Log to console
    if (dpLocation != -1){
        console.log("_prnStrs called with ->" + strIn + "<-, displaying ->" + xStr + "<- with decimal point after char #" + dpLocation + ". Add = " + bankAdd);
    } else {
        console.log("_prnStrs called with ->" + strIn + "<-, displaying ->" + xStr + "<-. Add = " + bankAdd);    
    }  
}

