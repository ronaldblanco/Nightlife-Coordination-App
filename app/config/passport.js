'use strict';

var twitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new twitterStrategy({
		consumerKey: configAuth.twitterAuth.clientID,
		consumerSecret: configAuth.twitterAuth.clientSecret,
		callbackURL: configAuth.twitterAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			
			User.findOne({ 'twitter.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.twitter.id = profile.id;
					newUser.twitter.username = profile.username;
					newUser.twitter.displayName = profile.displayName;
					newUser.twitter.photo = profile.photos[0].value;
					newUser.nbrClicks.clicks = 0;
					newUser.iamgoing.id = '';
					newUser.iamgoing.phone = '';

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		
			
		});
	}));
};
