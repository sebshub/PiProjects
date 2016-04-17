var request = require('request');
var events = require('events');
var parseString = require('xml2js').parseString;
var LED = require('alphanumeric-led');
var request = require('request');
var pnlMtr1 = require('panelmeter');
var rpio = require('rpio');

// Global Vars
var eventEmitter = new events.EventEmitter();
var lastLevel = 0;
var dfaltViewNum = 0;
var lastLevelTime;
var firstRun = 1;
var lvlNow;
var lvlFcst1Day;
var lvlFcst2Day;
var lvlFcst7Day;
var BTNpin = 32;        // p32/GPIO 12 (NO button connected to this pin and ground)
var LEDpin = 36;        // p36/GPIO 16 (LED connected to 240 ohm resistor)

setupEventHandlers();

console.log("Setting up LED output on pin " + LEDpin);
rpio.open(LEDpin, rpio.OUTPUT, rpio.LOW);

console.log("Setting button input on pin " + BTNpin);
rpio.open(BTNpin, rpio.INPUT, rpio.PULL_UP);        // setup pin for input use internal pull up resistor
rpio.poll(BTNpin, pollcb);

LED.setBright(8); 

console.log("Reading river gauge data from internet...");
LED.prn2Strs("GET ", "DATA");
getData();

// Start Timed events
var TimedEvt = setInterval(function(){getData()}, 900000);                  // 900,000ms =  15 minutes

function getData(){
    LEDsetOnOff(1);                                                         // turn LED in button on
    request('http://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=grfi2&output=xml', function (error, response, body) {
    if (!error && response.statusCode == 200) {   
        parseString(body, function(error, result){
        if(error){
            console.log("Error: " + error);
            return;
        }

        // setup vars
        var siteName = result.site.$.name
        var siteId = result.site.$.id
        var currentLvl = result.site.observed[0].datum[0].primary[0]._;
        var currentLvlTime = new Date(result.site.observed[0].datum[0].valid[0]._);
                
        var frcst1DayLvl = result.site.forecast[0].datum[3].primary[0]._;
        var frcst1DayTime = new Date(result.site.forecast[0].datum[3].valid[0]._);     
        var change1Day = 12 * (Number(frcst1DayLvl) - Number(currentLvl));        // caculate the change in inches   

        var frcst2DayLvl = result.site.forecast[0].datum[7].primary[0]._;
        var frcst2DayTime = new Date(result.site.forecast[0].datum[7].valid[0]._);
        var change2Day = 12 * (Number(frcst2DayLvl) - Number(currentLvl));        // caculate the change in inches 
                
        var frcst7DayLvl = result.site.forecast[0].datum[27].primary[0]._;
        var frcst7DayTime = new Date(result.site.forecast[0].datum[27].valid[0]._);   
        var change7Day = 12 * (Number(frcst7DayLvl) - Number(currentLvl));        // caculate the change in inches     
        
        //set Globals
        lvlNow = Number(currentLvl);
        lvlFcst1Day = Number(frcst1DayLvl);
        lvlFcst2Day = Number(frcst2DayLvl);
        lvlFcst7Day = Number(frcst7DayLvl);      
        
        //log values to screen
        console.log("Site Name = " + siteName);
        console.log("Site ID = " + siteId);      
        console.log("Current river level = " + currentLvl + ", time of reading = " + currentLvlTime.toLocaleTimeString());
        console.log("24 hr forecast levl = " + frcst1DayLvl +", change = " + change1Day.toFixed(2) + " inches, forecast time: " + frcst1DayTime);
        console.log("48 hr forecast levl = " + frcst2DayLvl +", change = " + change2Day.toFixed(2) + " inches, forecast time: " + frcst2DayTime);
        console.log("7 day forecast levl = " + frcst7DayLvl +", change = " + change7Day.toFixed(2) + " inches, forecast time: " + frcst7DayTime);    
        
        var timeOfThisReading = currentLvlTime.toLocaleTimeString();
        if (timeOfThisReading != lastLevelTime){
            lastLevelTime = timeOfThisReading;
            eventEmitter.emit('newDataReceived');
        } else {
            eventEmitter.emit('DataReceived');
        }
        LEDsetOnOff(0);                                                         // turn LED off
       });}
    })
}

function showRvrLvl(viewNum){
    
    switch(viewNum){
        case 0:     // Display current value in feet and inches
            // Convert river value from feet in fractions to feet and inches
            var mantissa = Math.floor(lvlNow);              // get number to left of decimal without rounding
            var decInches = (lvlNow - mantissa);            // get decimal value
            decInches = (Math.floor(decInches * 10)) * 1.2; // The first 10's decimal point value 0.987 becomes 9.0 * 1.2 to give inches
            var mantissaString = mantissa + String.fromCharCode(18);
            var decInchesString = decInches.toFixed(0) + String.fromCharCode(19) + " ";
            // Center numbers in display by adding spaces
            if (mantissa < 10){mantissaString = " " + mantissaString;}
            if (decInches < 10){decInchesString = decInchesString + " ";}
            // Send values to LED display and panel meter
            LED.prn2Strs(mantissaString, decInches.toFixed(0) + String.fromCharCode(19) + " ");
            pnlMtr1.setPanelMeter(lvlNow);
            break;
            
        case 1:     // Display current value in decimal feet
            LED.prn2Strs("NOW", lvlNow.toFixed(1) + String.fromCharCode(18));
            pnlMtr1.setPanelMeter(lvlNow);
            break;    
            
        case 2:     // Display 1 day forecast in decimal feet
            LED.prn2Strs("1DAY", lvlFcst1Day.toFixed(1) + String.fromCharCode(18)); 
            pnlMtr1.setPanelMeter(lvlFcst1Day);
            break;           
            
        case 3:     // Display 2 day forecast in decimal feet
            LED.prn2Strs("2DAY", lvlFcst2Day.toFixed(1) + String.fromCharCode(18)); 
            pnlMtr1.setPanelMeter(lvlFcst2Day);
            break;                       
            
        case 4:     // Display 7 day forecast in decimal feet
            LED.prn2Strs("7DAY", lvlFcst7Day.toFixed(1) + String.fromCharCode(18)); 
            pnlMtr1.setPanelMeter(lvlFcst7Day);
            break;
            
        default:
            showRvrLvl(0);
            console.warn("no case match for showRvrLvl, using default.");
            break;                                
    }       
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
	buttonState = rpio.read(cbpin) ? 'released':'pressed';   
	console.log('Button event on P%d (button currently %s)', cbpin, buttonState);
}

// Event handler setup
function setupEventHandlers(){
    eventEmitter.on('newDataReceived', function(){showRvrLvl(dfaltViewNum);});    
}

// Shutdow process
process.on( 'SIGINT', function() {
  console.log("\nGracefully Shutting Down..." );
  clearInterval(TimedEvt);
  console.log("Timed Events Stopped.");
  pnlMtr1.shutdown();
  console.log("Panel Meter is Shutdown.");
  rpio.open(LEDpin, rpio.INPUT); 
  console.log("LED pin set to input.");
  LED.prn2Strs("OFF-", "LINE");
  console.log("Exit message sent to LED display.");
  process.exit( );
})