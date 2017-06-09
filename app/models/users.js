'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
      publicRepos: Number
	},
	twitter: {
		id: String,
		displayName: String,
		username: String,
      photo: String
	},
	iamgoing: {
	    id: String,
	    phone: String
	},
   nbrClicks: {
      clicks: Number
   }
});

module.exports = mongoose.model('User', User);
