var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var data;
var port = 3001;
var ip = "127.0.0.1";
// var defaultCorsHeaders = {
//   "access-control-allow-origin": "*",
//   "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "access-control-allow-headers": "content-type, accept",
//   "access-control-max-age": 10, // Seconds.
//   "Content-Type": 'text/plain'
// };
var setCorsHeaders = function (response) {
  response.set({
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": 'text/plain'
  });
  return response;
};
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
fs.readFile('./data.json', function(err, fileData) {
  if(err) {
    throw err;
  }
  data = JSON.parse(fileData);
});


// Setting up different routes
app.get('/', function(req, res){
  setCorsHeaders(res);
  console.log(res);
  // allFiles(req, res, filePath, 'html')
  res.send('Hello World');
});

// Helper functions
var allFiles = function(request, response, filePath, fileType) {
  var statusCode = 200;
  var filePath = path.join(__dirname, filePath);
  console.log(filePath);
  // defaultCorsHeaders['Content-Type'] = 'text/' + fileType;
  setCorsHeaders(response);
  response.set('Content-Type', 'text/' + fileType);
  response.sendfile(filePath);
};




