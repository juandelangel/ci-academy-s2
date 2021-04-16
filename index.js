const https = require('https');
const fs = require('fs');

app.get('/home', (req, res) => {
    res.sen('<h1>Hello2!</h1>')
})

const certPath = '/etc/letsencrypt/live/condorinnovationacademy.online';
https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/condorinnovationacademy.online/privkey.pem'),
    cert: fs.readFileSync( '/etc/letsencrypt/live/condorinnovationacademy.online/fullchain.pem')
}, (req, res) => { res.end('<h1>Hello!</h1>') }
).listen(443);