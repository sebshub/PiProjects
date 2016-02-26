console.log("index.js loading...");
var LED = require('./alphNumDriver.js');
var http = require('http'), port = 8088;

var server = http.createServer(function(request, response) {
 
    if (request.url === '/trigger' && request.method == 'GET') {
      // turn on the buzzer 
      LED.prnStr("BANG");
 
      response.writeHeader(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      response.write('{ "status": true }');
      response.end();
 
    } else {
     console.log("called with: " + request);
      response.writeHeader(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      response.write('{ "status": true }');
      response.end();
    }
})

  server.listen(port);
  console.log("Server Running on " + port + ".\nLaunch http://localhost:" + port);
  return server;



