'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/github/callback'
	},
	'yelpAuth': {
		'clientID': process.env.YELP_KEY,
		'clientSecret': process.env.YELP_SECRET,
		'tokenUrl': process.env.YELP_URL_TOKEN
	}
};
