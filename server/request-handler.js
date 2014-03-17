/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var data = {
  results: [
    {
      roomname: "lobby",
      text: "hello",
      username: "gary"
    },
    {
      roomname: "roooom",
      text: "it's us!",
      username: "will&allegra"
    }
  ]
};

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  if(request.url === '/1/classes/chatterbox') {
    validUrl(request, response, headers);
  }
  else {
    invalidUrl(request, response, headers);
  }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var validUrl = function(request, response, headers) {
  /* .writeHead() tells our server what HTTP status code to send back */
  var statusCode = 200;
  response.writeHead(statusCode, headers);
  if(request.method === 'POST') {
    response.end("POST successful!");
  }
  else if(request.method === 'GET') {
    // response.end("GET successful!");
    response.write(JSON.stringify(data));
    response.end();
  }
  else {
    response.end("SOMETHING ELSE successful!");
  }
  
};
var invalidUrl = function(request, response, headers) {
  /* .writeHead() tells our server what HTTP status code to send back */
  var statusCode = 400;
  response.writeHead(statusCode, headers);
  response.end("Bad Url!");
};

module.exports = {
  handleRequest: handleRequest
};