const http = require('http');
const https = require('https');
const handler = (req, res) => res.end('<h1>Hello!</h1>');
http.createServer(handler).listen(8081);
https.createServer(handler).listen(8443);