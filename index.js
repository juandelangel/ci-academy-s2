const fs = require('fs');
const https = require('https');
const express = require('express');

const PORT = 443;

const app = express();

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/condorinnovationacademy.online/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/condorinnovationacademy.online/fullchain.pem')
}, app).listen(PORT, function(){
  console.log("My HTTPS server listening on port " + PORT + "...");
});

app.get('/foo', function(req, res){
  console.log('Hello, I am foo.');
});

app.get('/', function(req, res){
  console.log('Hello shikita.');
});