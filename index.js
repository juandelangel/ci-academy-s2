const fs = require('fs');
const https = require('https');
const express = require('express');
const axios = require('axios');
const axiosVimeo = require('axios');
const cors = require('cors');
const PORT = 443;
var propertiesReader = require('properties-reader');
var properties = propertiesReader(__dirname+'/project.properties');
var user = properties.get('user.name');
var password = properties.get('user.password');
var vimeoToken=properties.get('vimeo.token');
var vimeoUriRedirect=properties.get('vimeo.uri.redirect');
var apexUri=properties.get('apex.uri');

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

const app = express();
app.use(cors())
https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/condorinnovationacademy.online/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/condorinnovationacademy.online/fullchain.pem')
}, app).listen(PORT, function(){
  console.log("My HTTPS server listening on port " + PORT + "...");
});

app.get('/foo', function(req, res){
  res.send('Hello, I am foo.');
});

app.get('/', function(req, res){
  res.send('Hello shikita.');
});

app.get('/file', function(req, res){
  console.log(req.query)
  console.log(__dirname)
  var contentId=req.query.contentId;
  var key=req.query.key;
  var user=req.query.user;
  var bucket=req.query.bucket;
  var prefix=apexUri+'/ords/ci_academy/ci-academy/content/file?';
  var url=prefix+'CONTENT_ID='+contentId+'&KEY='+key+'&BUCKET='+bucket+'&USER='+user;
  client.post(url,'',config).then(function (response) {
    console.log(response.status);
  })
  res.sendFile('/index.html', {root: __dirname})
});

app.get('/upload-form',function(req,res){
	var prefix=vimeoUriRedirect+'/video?videoName='
	var url=prefix+req.query.videoName+'&courseId='+req.query.courseId;
    var data={
  			"upload": {
    			"approach": "post",
    			"redirect_url": url
  			},
  			"name":req.query.videoName,
  			"privacy":{
      			"download": false,
      			"view": "unlisted",
      			"comments": "nobody" 
  			}
			}
	var url='https://api.vimeo.com/me/videos';
	axiosVimeo.post(url,data,'').then(function (response) {
	var response ={
		"formData":response.data.upload.form
	}
	res.send(response);
	})
});

app.get('/video', function(req, res){
	res.sendFile('/index.html', {root: __dirname});
});
