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
const yelp = require('yelp-fusion');
//console.log(process.env.YELP_KEY); 
//console.log(process.env.YELP_SECRET); 
const token = yelp.accessToken(process.env.YELP_KEY, process.env.YELP_SECRET).then(response => {
  console.log(response.jsonBody.access_token);
}).catch(e => {
  console.log(e);
});
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

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
