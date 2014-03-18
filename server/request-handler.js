var fs = require('fs');
var path = require('path');

var data;

fs.readFile('./data.json', function(err, fileData) {
  if(err) {
    throw err;
  }
  data = JSON.parse(fileData);
});

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";
  if (request.url === '/' || request.url.indexOf('/?username=') !== -1) {
    allFiles(request, response, headers, '/index.html', 'html');
  }
  else if(request.url.indexOf('/styles') !== -1) {
    allFiles(request, response, headers, request.url, 'css');
  }
  else if(request.url.indexOf('/scripts') !== -1 || request.url.indexOf('/bower_components') !== -1) {
    allFiles(request, response, headers, request.url, 'javascript');
  }
  else if(request.url === '/1/classes/chatterbox' || request.url === '/classes/messages' || request.url === '/classes/room1') {
    validUrl(request, response, headers);
  }
  else {
    invalidUrl(request, response, headers);
  }
};

var allFiles = function(request, response, headers, filePath, fileType) {
  var statusCode = 200;
  var filePath = path.join(__dirname, filePath);
  console.log(filePath);
  headers['Content-Type'] = 'text/' + fileType;
  response.writeHead(statusCode, headers);

  var readStream = fs.createReadStream(filePath);
  readStream.pipe(response);
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