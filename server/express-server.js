var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var data;
var port = 3001;
var ip = "127.0.0.1";

var setCorsHeaders = function (response, fileType) {
  response.set({
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": fileType
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
  setCorsHeaders(res, 'text/html');
  res.sendfile('./index.html');
});

app.get('/scripts/:scriptName', function(req, res) {
  setCorsHeaders(res, 'text/javascript');
  res.sendfile('./scripts/' + req.params.scriptName);
});

app.get('/styles/:styleName', function(req, res) {
  setCorsHeaders(res, 'text/css');
  res.sendfile('./styles/' + req.params.styleName);
});

app.get('/bower_components/:folder/:bowerName', function(req, res) {
  setCorsHeaders(res, 'text/javascript');
  res.sendfile('./bower_components/' + req.params.folder + '/' + req.params.bowerName);
});

app.get('/1/classes/chatterbox', function(req, res) {
  setCorsHeaders(res, 'application/json');
  res.send(JSON.stringify(data));
});

app.post('/1/classes/chatterbox', function(req, res){
  var dataHolder = '';
  req.on('data', function(dataChunk){
    dataHolder += dataChunk.toString();
  });
  req.on('end', function() {
    data.results.push(JSON.parse(dataHolder));
    res.send("Successfully POSTED");
  });
});



