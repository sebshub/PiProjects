console.log("index.js loading...");
var LED = require('./alphNumDriver.js');
var http = require('http'), port = 8088;

var server = http.createServer(function(request, response) {
 
    if (request.method == 'GET') {
      var cmdStr = request.url;
      var cmdStrArr = cmdStr.split("=");
      if (cmdStrArr[0].includes("txtToDisplay")){
       LED.prnStr(cmdStrArr[1]);
      } else {
       console.log("Err: ->" + cmdStrArr[0] + "<- Not valid command")
      }
      response.writeHeader(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      response.write('{ "status": true }');
      response.end();
 
    } else {
     console.log("called with: " + request.url);
      response.writeHeader(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      response.write('{ "status": false }');
      response.end();
    }
})

  server.listen(port);
  console.log("Server Running on " + port + ".\nLaunch http://localhost:" + port);
  return server;



