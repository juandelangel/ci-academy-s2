const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const configJwt = require('./configs/config')
const axios = require('axios');
const axiosVimeo = require('axios');
const cors = require('cors');
const PORT = 8443;
const app = express();
app.use(cors());
var propertiesReader = require('properties-reader');
var properties = propertiesReader(__dirname+'/project.properties');
var authUser = properties.get('auth.User');
var authPassword = properties.get('auth.Password');
var user = properties.get('user.name');
var password = properties.get('user.password');
var vimeoToken=properties.get('vimeo.token');
var vimeoUriRedirect=properties.get('vimeo.uri.redirect');
var apexUri=properties.get('apex.uri');

app.set('key', configJwt.key);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

axiosVimeo.defaults.headers.common= {'Authorization': 'Bearer '+vimeoToken}

const client = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});
let config = {
  auth: {
    username: user,
    password: password
  }
}




//app.use(cors());

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/api-failover-test1.online/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api-failover-test1.online/fullchain.pem')
}, app).listen(PORT, function(){
  console.log("My HTTPS server listening on port " + PORT + "...");
});



app.post('/test', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.send('{ "hasError": false, "errors": [], "data": { "rate": { "inflation": 0.006097 }, "fee": { "cardReplacementFee": 0.00, "annuity": 500.00, "collectionExpenses": 400.00 }, "totalAnnualCostValue": 3130000 } }');
});




//app.listen(3000, () => console.log('SERVIDOR FUNCIONANDO'))