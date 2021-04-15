const https = require('https');
const fs = require('fs');
const path = require('path');
https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
}, (req, res) => { res.end('<h1>Hello!</h1>') }
).listen(8443);