var request = require('request');
// var parseString = require("xml2js").parseString;

console.log("Read river gauge starting up...");
var rawXML = "";
// 

var request = require('request');
request('http://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=grfi2&output=xml', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //console.log(body) // Show the HTML for the Google homepage.
    rawXML = body;
    console.log ("rawXML = " + rawXML);
    /*
    parseString(rawXML, function(error, result){
      if(error){
        console.log("Error: " + error);
        return;
      }
      console.dir(JSON.stringify(result));
    });
    */
    
    
  // lines below where here  
  }
})
