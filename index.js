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
  var contentId=req.query.contentId;
  var key=req.query.key;
  var user=req.query.user;
  var bucket=req.query.bucket;
  var prefix=apexUri+'/ords/ci_academy/ci-academy/content/file?';
  var url=prefix+'CONTENT_ID='+contentId+'&KEY='+key+'&BUCKET='+bucket+'&USER='+user;
  client.post(url,'','').then(function (response) {
    console.log(response.status);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
  res.sendFile('/index.html', {root: __dirname})
});

app.get('/question/file', function(req, res){
  var questionId=req.query.questionId;
  console.log('questionId:'+questionId);
  var key=req.query.key;
  var user=req.query.user;
  var bucket=req.query.bucket;
  var prefix=apexUri+'/ords/ci_academy/ci-academy/question/file?';
  var url=prefix+'questionId='+questionId+'&key='+key+'&bucket='+bucket+'&user='+user;
  console.log('url:'+url);
  client.post(url,'','').then(function (response) {
    console.log(response.status);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
  res.sendFile('/index.html', {root: __dirname})
});

app.get('/answer/file', function(req, res){
  var answerId=req.query.answerId;
  var key=req.query.key;
  var user=req.query.user;
  var bucket=req.query.bucket;
  var prefix=apexUri+'/ords/ci_academy/ci-academy/answer/file?';
  var url=prefix+'answerId='+answerId+'&key='+key+'&bucket='+bucket+'&user='+user;
  client.post(url,'','').then(function (response) {
    console.log(response.status);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
  res.sendFile('/index.html', {root: __dirname})
});


app.get('/exam/file', function(req, res){
  var examId=req.query.examId;
  var key=req.query.key;
  var user=req.query.user;
  var bucket=req.query.bucket;
  var prefix=apexUri+'/ords/ci_academy/ci-academy/exam/file?';
  var url=prefix+'examId='+examId+'&key='+key+'&bucket='+bucket+'&user='+user;
  client.post(url,'','').then(function (response) {
    console.log(response.status);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
  res.sendFile('/index.html', {root: __dirname})
});

app.get('/exam-application/file', function(req, res){
  var examApplicationId=req.query.examApplicationId;
  var key=req.query.key;
  var user=req.query.user;
  var bucket=req.query.bucket;
  var prefix=apexUri+'/ords/ci_academy/ci-academy/exam-application/file?';
  var url=prefix+'examApplicationId='+examApplicationId+'&key='+key+'&bucket='+bucket+'&user='+user;
  client.post(url,'','').then(function (response) {
    console.log(response.status);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
  res.sendFile('/index.html', {root: __dirname})
});

app.get('/upload-form',function(req,res){
  var prefix=vimeoUriRedirect+'/video?videoName='
   if(req.query.contentId!=null){
    var url=prefix+req.query.videoName+'&contentId='+req.query.contentId;
  }
  if(req.query.courseId!=null){
    var url=prefix+req.query.videoName+'&courseId='+req.query.courseId;
  }
  if(req.query.examId!=null){
    var url=prefix+req.query.videoName+'&examId='+req.query.examId;
  }
  if(req.query.examApplicationId!=null){
    var url=prefix+req.query.videoName+'&examApplicationId='+req.query.examApplicationId;
  }

  console.log(url);
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
    "uri":response.data.uri,
    "link":response.data.link,
    "formData":response.data.upload.form
  }
  res.send(response);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
});

app.get('/video', function(req, res){
  var contentId=req.query.contentId;
  var url='';
  if(req.query.contentId!=null){
    url=apexUri+'/ords/ci_academy/ci-academy/content/video?contentId='+contentId;
  }
  if(req.query.examId!=null){
    url=apexUri+'/ords/ci_academy/ci-academy/exam/video?examId='+req.query.examId;
  }
  if(req.query.examApplicationId!=null){
    url=apexUri+'/ords/ci_academy/ci-academy/exam-application/video?examApplicationId='+req.query.examApplicationId;
  }
  client.put(url,'','').then(function (response) {
    console.log(response.status);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
  res.sendFile('/index.html', {root: __dirname});
});

app.get('/video/delete',function(req,res){
  var videoId=req.query.videoId;
  var url='https://api.vimeo.com/videos/'+videoId;
  axiosVimeo.delete(url,'','').then(function (response) {
    console.log(response.status);
    var response ={
    "status":"success"
  }
  res.send(response);
  }).catch(function (error) {
    // handle error
    console.log(error);
  })
});

app.get('/video/update',function(req,res){
  var videoId=req.query.videoId;
  var videoName=req.query.videoName;
  var url='https://api.vimeo.com/videos/'+videoId;
  var data ={
    name:videoName
  }
  axiosVimeo.patch(url,data,'').then(function (response) {
    console.log(response.status);
    var response ={
    "status":"success"
  }
  res.send(response);
  }).catch(function (error) {
    // handle error
    console.log(error);
  });

})