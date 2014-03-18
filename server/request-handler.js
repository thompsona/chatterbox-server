/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var fs = require('fs');

var data = {
  results: []
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
  if(request.url === '/') {
    // console.log("Reached /");
    callHome(request, response, headers);
  }
  else if(request.url === '/styles/styles.css') {
    var statusCode = 200;
    var data = '';
    fs.readFile('../client/styles/styles.css', function(error, html) {
      if(error) {
        console.log('callHome error');
      }
      else {
        data += html;
        // console.log("data is: " + data);
        // console.log(typeof data);
        headers['Content-Type'] = 'text/css';
        response.writeHead(statusCode, headers);
        console.log('data2: ' + data);
        response.end(data);
      }
    });
  }
  else if(request.url === '/scripts/config.js' || request.url === '/scripts/Template.js' || request.url === '/scripts/app.js') {
    jsFiles(request, response, headers, request.url);
  }
  else if(request.url === '/1/classes/chatterbox' || request.url === '/classes/messages' || request.url === '/classes/room1') {
    validUrl(request, response, headers);
  }
  // else if(request.url === '/bower_components/jquery/jquery.min.js' || request.url === '/bower_components/underscore/underscore.js' || request.url === '/bower_components/jquery-prettydate/jquery.prettydate.js') {
  //   bowerFiles(request, response, headers, request.url);
  // }
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

var bowerFiles = function(request, response, headers, filePath) {
  var statusCode = 200;
    var data = '';
    fs.readFile('..' + filePath, function(error, html) {
      if(error) {
        console.log('callHome error');
      }
      else {
        data += html;
        console.log("data is: " + data);
        console.log(typeof data);
        headers['Content-Type'] = 'text/javascript';
        response.writeHead(statusCode, headers);
        response.end(data);
      }
    });
};

var jsFiles = function(request, response, headers, filePath) {
  var statusCode = 200;
    var data = '';
    fs.readFile('../client' + filePath, function(error, html) {
      if(error) {
        console.log('callHome error');
      }
      else {
        data += html;
        // console.log("data is: " + data);
        // console.log(typeof data);
        headers['Content-Type'] = 'text/javascript';
        response.writeHead(statusCode, headers);
        response.end(data);
      }
    });
};

var callHome = function(request, response, headers) {
  var statusCode = 200;
  var data = '';
  fs.readFile('../client/index.html', function(error, html) {
    if(error) {
      console.log('callHome error');
    }
    else {
      data += html;
      // console.log("data is: " + data);
      // console.log(typeof data);
      headers['Content-Type'] = 'text/html';
      response.writeHead(statusCode, headers);
      console.log('data2: ' + data);
      response.end(data);
    }
  });
};

var validUrl = function(request, response, headers) {
  var statusCode;
  if(request.method === 'POST') {
    statusCode = 201;
    response.writeHead(statusCode, headers);
    var dataHolder = '';
    request.on('data', function(dataChunk){
      dataHolder += dataChunk.toString();
    });
    request.on('end', function() {
      data.results.push(JSON.parse(dataHolder));
      response.end("Successfully POSTED");
    });
  }
  else if(request.method === 'GET') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
    // response.end();
  }
  else {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end("Please do a POST or GET request!");
  }
};

var invalidUrl = function(request, response, headers) {
  var statusCode = 404;
  response.writeHead(statusCode, headers);
  response.end("Bad Url!");
};


module.exports = {
  handler: handleRequest
};