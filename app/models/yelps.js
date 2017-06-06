'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Yelp = new Schema({
	token: {
		access_token: String,
		token_type: String,
      expires_in: Number
	}
});

module.exports = mongoose.model('Yelp', Yelp);
