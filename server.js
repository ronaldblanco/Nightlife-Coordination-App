'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;


//YELP TOKEN//////////
//var yelpToken;
/*const yelp = require('yelp-fusion');
var token;
//console.log(process.env.YELP_KEY); 
//console.log(process.env.YELP_SECRET); 
var getToken = yelp.accessToken(process.env.YELP_KEY, process.env.YELP_SECRET).then(response => {
	//token = JSON.parse(response.jsonBody);
  //console.log(token);
  console.log(response.jsonBody);
}).catch(e => {
  console.log(e);
});*/
//console.log(token);
//////////////////////


app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport/*, token*/);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
