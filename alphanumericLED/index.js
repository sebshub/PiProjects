console.log("index.js loading...");
var LED = require('./alphNumDriver.js');

var i = 9999
while (i > 0){
  LED.prnStr(i.toString());
  i--;
}




