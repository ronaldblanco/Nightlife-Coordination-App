'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PublicHandler = require(path + '/app/controllers/publicHandler.server.js');

module.exports = function (app, passport/*, token*/) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	function notLoggedIn (req, res, next) {
		//if (req.isAuthenticated()) {
			return next();
		//} else {
			//res.redirect('/login');
		//}
	}

	var clickHandler = new ClickHandler();
	var publicHandler = new PublicHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	/*app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});*/
		
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.twitter);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));
		
	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		
	app.route('/api/:id/gettoken')
		.get(notLoggedIn, publicHandler.getToken)
		//.get(notLoggedIn, publicHandler.search)
		//.delete(isLoggedIn, clickHandler.resetClicks);
		
	app.route('/api/:id/getsavetoken')
		.get(notLoggedIn, publicHandler.getSaveToken)
		
	app.route('/api/:id/search/*')
		.get(notLoggedIn, publicHandler.search)
		
	app.route('/api/:id/searchiamgoing/*')
		.get(isLoggedIn, publicHandler.setIamgoing)
		
	app.route('/api/:id/searchrmiamgoing')
		.get(isLoggedIn, publicHandler.rmIamgoing)
		
	app.route('/api/:id/iamgoing')
		.get(isLoggedIn, publicHandler.getIamgoing)
		
	app.route('/api/:id/iamgoingothers')
		.get(isLoggedIn, publicHandler.getOthersIamgoing)
		
	app.route('/api/:id/searchget')
		.get(notLoggedIn, publicHandler.getSearch)
};
